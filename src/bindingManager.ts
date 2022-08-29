import { CacheType, Client, CommandInteraction } from "discord.js";
import { Tags } from "./db";
import { CourseLevel, OverarchingCategory } from "./roles";

type RoleCategoryOption =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "grad"
  | "pronoun"
  | "other";

const EMOTE_NOT_FOUND =
  "We couldn't find your specified emote but everything else was saved properly.";

export const handleCreateRoleBinding = async (
  interaction: CommandInteraction<CacheType>,
  client: Client
) => {
  const name = interaction.options.getString("label", true);
  const roleId = interaction.options.getRole("role", true).id;
  const emoji = await validateEmoji(
    interaction.options.getString("emoji", false),
    client
  );
  const responseCategory = interaction.options.getString(
    "category",
    true
  ) as RoleCategoryOption;
  const description = interaction.options.getString("description", false);

  const errors: string[] = [];
  if (emoji === undefined) errors.push(EMOTE_NOT_FOUND);

  const [courseCategory, overarchingCategory] =
    distillCategory(responseCategory);

  try {
    const tag = await Tags.create({
      name,
      description,
      roleId,
      emoji,
      class: courseCategory,
      category: overarchingCategory,
    });

    return interaction.reply({
      content:
        `Role binding ${tag.getDataValue("name")} created. ` +
        errors.join(", "),
      ephemeral: true,
    });
  } catch (e: any) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return interaction.reply({
        content: "That tag already exists.",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: "Something went wrong with adding a tag.",
      ephemeral: true,
    });
  }
};

export const handleDeleteRoleBinding = async (
  interaction: CommandInteraction<CacheType>
) => {
  const role = interaction.options.getRole("role", true);

  const result = await Tags.destroy({ where: { roleId: role.id } });

  if (result > 0)
    return interaction.reply({
      content: `Successfully deleted binding for role ${role.name}.`,
      ephemeral: true,
    });
  else
    return interaction.reply({
      content: `Couldn't find a binding for role ${role.name}.`,
      ephemeral: true,
    });
};

export const handleUpdateRoleBinding = async (
  interaction: CommandInteraction<CacheType>,
  client: Client
) => {
  const role = interaction.options.getRole("role", true);
  const { id: roleId } = role;

  const name = interaction.options.getString("label", false);
  const emoji = await validateEmoji(
    interaction.options.getString("emoji", false),
    client
  );
  const responseCategory = interaction.options.getString(
    "category",
    false
  ) as RoleCategoryOption;
  const description = interaction.options.getString("description", false);
  const rank = interaction.options.getInteger("rank", false);

  const errors: string[] = [];
  if (emoji === undefined) errors.push(EMOTE_NOT_FOUND);

  const changes: Record<string, string | number | null> = {};

  if (name) changes["name"] = name;

  if (responseCategory) {
    const [courseLevel, overarchingCategory] =
      distillCategory(responseCategory);
    changes["class"] = courseLevel;
    changes["category"] = overarchingCategory;
  }

  if (emoji) {
    changes["emoji"] = emoji;
  }

  if (description) {
    changes["description"] = description;
  }

  if (rank) {
    if (rank === 0) changes["rank"] = null;
    else changes["rank"] = rank;
  }

  const existingBinding = await Tags.findOne({ where: { roleId } });
  if (!existingBinding) {
    return interaction.reply({
      content: `Could not find a binding for ${role.name} to update.`,
      ephemeral: true,
    });
  }

  try {
    await existingBinding.update({ ...changes });
    return interaction.reply({
      content: `Successfully updated binding for <@&${roleId}>!`,
      ephemeral: true,
    });
  } catch (_error) {
    return interaction.reply({
      content: "Hmm... had an internal error updating that role.",
      ephemeral: true,
    });
  }
};

/**
 * Converts user input into strictly-typed categories.
 * @param cat User-entered category
 * @returns Structured data representing the course level of the role and what kind of role it is
 */
const distillCategory = (
  cat: RoleCategoryOption
): [CourseLevel | null, OverarchingCategory] => {
  let courseCategory: RoleCategoryOption | null = null;
  let overarchingCategory: OverarchingCategory | null = null;

  if (["freshman", "sophomore", "junior", "senior", "grad"].includes(cat)) {
    courseCategory = cat as CourseLevel;
    overarchingCategory = "course";
  } else {
    overarchingCategory = cat as OverarchingCategory;
  }

  return [courseCategory, overarchingCategory];
};

/**
 * Lookup an emote by name or ID and find its ID if not provided.
 * @param emoji Emote name or ID to lookup
 * @param client Discord client
 * @returns `undefined` if emote is provided and not found, `null` if emote is not provided,
 * or the emote ID if provided and found.
 */
const validateEmoji = async (
  emoji: string | null,
  client: Client
): Promise<string | null | undefined> => {
  if (emoji != null) {
    const foundEmote = client.emojis.cache.find(
      (emote) =>
        emote.name?.toLowerCase() === emoji?.trim().toLowerCase() ||
        emote.id === emoji?.trim()
    );
    return foundEmote?.id;
  }

  return null;
};
