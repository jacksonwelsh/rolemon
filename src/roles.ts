import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
} from "discord-api-types/v9";
import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  GuildMember,
  MessageActionRow,
  MessageActionRowComponent,
  MessageActionRowComponentResolvable,
  MessageSelectMenu,
} from "discord.js";
import { Model } from "sequelize";
import { Tags } from "./db";
import { userHasRole } from "./util";

export enum RoleType {
  FRESHMAN,
  SOPHOMORE,
  JUNIOR,
  SENIOR,
  GRAD,
  PRONOUN,
  CLASS,
  OTHER,
}

export type CourseLevel =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "grad";

export type OverarchingCategory = "course" | "pronoun" | "other";
type MessageRow = MessageActionRow<
  MessageActionRowComponent,
  MessageActionRowComponentResolvable,
  APIActionRowComponent<APIMessageActionRowComponent>
>;

export const sendRoleSelect = async (
  interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
  type: OverarchingCategory
) => {
  if (!interaction.guildId)
    return interaction.reply({
      content: "Could not get guild information",
      ephemeral: true,
    });
  const roles = await getStructuredRoles(interaction.guildId);
  console.log({ roles });

  let rows: MessageRow[];

  if (type === "course") {
    const freshmanRoles = roles[RoleType.FRESHMAN];
    const sophomoreRoles = roles[RoleType.SOPHOMORE];
    const juniorRoles = roles[RoleType.JUNIOR];
    const seniorRoles = roles[RoleType.SENIOR];
    const gradRoles = roles[RoleType.GRAD];

    rows = [
      freshmanRoles.length > 0
        ? new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("select-1000")
              .setMinValues(0)
              .setMaxValues(Math.min(25, freshmanRoles.length))
              .setPlaceholder("1000-level classes")
              .addOptions(
                freshmanRoles.map((role) => ({
                  ...role,
                  default: userHasRole(
                    role.roleId,
                    interaction.member as GuildMember
                  ),
                }))
              )
          )
        : null,
      sophomoreRoles.length > 0
        ? new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("select-2000")
              .setMinValues(0)
              .setMaxValues(Math.min(25, sophomoreRoles.length))
              .setPlaceholder("2000-level classes")
              .addOptions(
                sophomoreRoles.map((role) => ({
                  ...role,
                  default: userHasRole(
                    role.roleId,
                    interaction.member as GuildMember
                  ),
                }))
              )
          )
        : null,
      juniorRoles.length > 0
        ? new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("select-3000")
              .setMinValues(0)
              .setMaxValues(Math.min(25, juniorRoles.length))
              .setPlaceholder("3000-level classes")
              .addOptions(
                juniorRoles.map((role) => ({
                  ...role,
                  default: userHasRole(
                    role.roleId,
                    interaction.member as GuildMember
                  ),
                }))
              )
          )
        : null,
      seniorRoles.length > 0
        ? new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("select-4000")
              .setMinValues(0)
              .setMaxValues(Math.min(25, seniorRoles.length))
              .setPlaceholder("4000-level classes")
              .addOptions(
                seniorRoles.map((role) => ({
                  ...role,
                  default: userHasRole(
                    role.roleId,
                    interaction.member as GuildMember
                  ),
                }))
              )
          )
        : null,
      gradRoles.length > 0
        ? new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("select-5000")
              .setMinValues(0)
              .setMaxValues(Math.min(25, gradRoles.length))
              .setPlaceholder("5000-level classes")
              .addOptions(
                gradRoles.map((role) => ({
                  ...role,
                  default: userHasRole(
                    role.roleId,
                    interaction.member as GuildMember
                  ),
                }))
              )
          )
        : null,
    ].filter((item) => item != null) as MessageRow[];
  } else {
    const classRoles = roles[RoleType.CLASS];
    const pronounRoles = roles[RoleType.PRONOUN];

    rows = [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select-pronouns")
          .setMinValues(0)
          .setMaxValues(3)
          .setPlaceholder("Pronouns")
          .addOptions(
            pronounRoles.map((role) => ({
              ...role,
              default: userHasRole(
                role.roleId,
                interaction.member as GuildMember
              ),
            }))
          )
      ),
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select-class")
          .setMinValues(0)
          .setMaxValues(1)
          .setPlaceholder("Class")
          .addOptions(
            classRoles.map((role) => ({
              ...role,
              default: userHasRole(
                role.roleId,
                interaction.member as GuildMember
              ),
            }))
          )
      ),
    ];
  }

  await interaction.reply({
    content: "Pick some roles!",
    components: rows,
    ephemeral: true,
  });
};

const convertTag = (tag: Model<any, any>) => {
  const json = tag.toJSON();
  return {
    ...json,
    label: json.name,
    value: json.name.replaceAll(" ", ""),
  };
};

export const getStructuredRoles = async (guild: string) => {
  // only need read access, unwrap into primitives.
  const freshmanCourses = await Tags.findAll({
    where: { class: "freshman", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const sophomoreCourses = await Tags.findAll({
    where: { class: "sophomore", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const juniorCourses = await Tags.findAll({
    where: { class: "junior", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const seniorCourses = await Tags.findAll({
    where: { class: "senior", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const gradCourses = await Tags.findAll({
    where: { class: "grad", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const pronouns = await Tags.findAll({
    where: { category: "pronoun", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const classRoles = await Tags.findAll({
    where: { category: "class", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const other = await Tags.findAll({
    where: { category: "other", guild },
    order: [
      ["rank", "asc"],
      ["name", "asc"],
    ],
  }).then((tagsArray) => tagsArray.map(convertTag));

  return {
    [RoleType.FRESHMAN]: freshmanCourses,
    [RoleType.SOPHOMORE]: sophomoreCourses,
    [RoleType.JUNIOR]: juniorCourses,
    [RoleType.SENIOR]: seniorCourses,
    [RoleType.GRAD]: gradCourses,
    [RoleType.PRONOUN]: pronouns,
    [RoleType.CLASS]: classRoles,
    [RoleType.OTHER]: other,
  };
};
