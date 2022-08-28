import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  GuildMember,
  MessageActionRow,
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
  OTHER,
}

export const sendRoleSelect = async (
  interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>
) => {
  const roles = await getStructuredRoles();

  const freshmanRoles = roles[RoleType.FRESHMAN];
  const sophomoreRoles = roles[RoleType.SOPHOMORE];
  const juniorRoles = roles[RoleType.JUNIOR];
  const seniorRoles = roles[RoleType.SENIOR];
  const gradRoles = roles[RoleType.GRAD];

  const rows = [
    new MessageActionRow().addComponents(
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
    ),
    new MessageActionRow().addComponents(
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
    ),
    new MessageActionRow().addComponents(
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
    ),
    new MessageActionRow().addComponents(
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
    ),
    new MessageActionRow().addComponents(
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
    ),
  ];

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

export const getStructuredRoles = async () => {
  // only need read access, unwrap into primitives.
  const freshmanCourses = await Tags.findAll({
    where: { class: "freshman" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const sophomoreCourses = await Tags.findAll({
    where: { class: "sophomore" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const juniorCourses = await Tags.findAll({
    where: { class: "junior" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const seniorCourses = await Tags.findAll({
    where: { class: "senior" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const gradCourses = await Tags.findAll({
    where: { class: "grad" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const pronouns = await Tags.findAll({
    where: { category: "pronoun" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const other = await Tags.findAll({
    where: { category: "other" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));

  return {
    [RoleType.FRESHMAN]: freshmanCourses,
    [RoleType.SOPHOMORE]: sophomoreCourses,
    [RoleType.JUNIOR]: juniorCourses,
    [RoleType.SENIOR]: seniorCourses,
    [RoleType.GRAD]: gradCourses,
    [RoleType.PRONOUN]: pronouns,
    [RoleType.OTHER]: other,
  };
};
