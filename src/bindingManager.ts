import { CacheType, Client, CommandInteraction } from "discord.js";
import { Tags } from "./db";

type RoleCategoryOption =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "grad"
  | "pronoun"
  | "other";

type CourseLevel = "freshman" | "sophomore" | "junior" | "senior" | "grad";

type OverarchingCategory = "course" | "pronoun" | "other";

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

    return interaction.reply(
      `Role binding ${tag.getDataValue("name")} created. ` + errors.join(", ")
    );
  } catch (e: any) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return interaction.reply("That tag already exists.");
    }

    return interaction.reply("Something went wrong with adding a tag.");
  }
};

export const handleDeleteRoleBinding = async (
  interaction: CommandInteraction<CacheType>
) => {
  const role = interaction.options.getRole("role", true);

  const result = await Tags.destroy({ where: { roleId: role.id } });

  if (result > 0)
    return interaction.reply(
      `Successfully deleted binding for role ${role.name}.`
    );
  else
    return interaction.reply(`Couldn't find a binding for role ${role.name}.`);
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

  const errors: string[] = [];
  if (emoji === undefined) errors.push(EMOTE_NOT_FOUND);

  const changes: Record<string, string | null> = {};

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

  const existingBinding = await Tags.findOne({ where: { roleId } });
  if (!existingBinding) {
    return interaction.reply(
      `Could not find a binding for ${role.name} to update.`
    );
  }

  try {
    await existingBinding.update({ ...changes });
    return interaction.reply(`Successfully updated binding for <@&${roleId}>!`);
  } catch (_error) {
    return interaction.reply(
      "Hmm... had an internal error updating that role."
    );
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
