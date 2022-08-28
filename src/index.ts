import {
  Client,
  GuildMember,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import environment from "./env";
import { getStructuredRoles, RoleType } from "./roles";
import { Tags } from "./db";
import {
  handleCreateRoleBinding,
  handleDeleteRoleBinding,
  handleUpdateRoleBinding,
} from "./bindingManager";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  Tags.sync();
  console.log("ready!");
});

client.login(environment.token);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  console.log({ interaction });

  if (interaction.commandName === "rolebinding") {
    if (interaction.options.getSubcommand() == "create") {
      return await handleCreateRoleBinding(interaction, client);
    } else if (interaction.options.getSubcommand() === "delete") {
      return await handleDeleteRoleBinding(interaction);
    } else if (interaction.options.getSubcommand() === "update") {
      return await handleUpdateRoleBinding(interaction, client);
    }
  }

  if (interaction.commandName === "roles") {
    const roles = await getStructuredRoles();

    const freshmanRoles = roles[RoleType.FRESHMAN];
    const sophomoreRoles = roles[RoleType.SOPHOMORE];
    const juniorRoles = roles[RoleType.JUNIOR];
    const seniorRoles = roles[RoleType.SENIOR];
    const gradRoles = roles[RoleType.GRAD];

    console.log({ seniorRoles });

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

    console.log({ rows });

    await interaction.reply({
      content: "Pick some roles!",
      components: rows,
      ephemeral: true,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;
  const roles = await getStructuredRoles();

  let roleClass: RoleType;

  switch (interaction.customId) {
    case "select-1000":
      roleClass = RoleType.FRESHMAN;
      break;
    case "select-2000":
      roleClass = RoleType.SOPHOMORE;
      break;
    case "select-3000":
      roleClass = RoleType.JUNIOR;
      break;
    case "select-4000":
      roleClass = RoleType.SENIOR;
      break;
    case "select-5000":
      roleClass = RoleType.GRAD;
    default:
      roleClass = RoleType.OTHER;
  }

  const member: any = interaction.member as GuildMember;

  console.log({ values: interaction.values });

  const rolesToRemove = roles[roleClass]
    .filter((r) => !interaction.values.includes(r.value))
    .filter((r) => userHasRole(r.roleId, member as GuildMember))
    .map((r) => r.roleId);

  const rolesToApply = interaction.values.map(
    (value) => roles[roleClass].find((r) => r.value === value)?.roleId
  );

  rolesToApply.forEach((role) => member.roles.add(role));
  rolesToRemove.forEach((role) => member.roles.remove(role));

  const roleMentions = rolesToApply.map((roleId) => `<@&${roleId}>`).join(" ");

  interaction.reply({
    content: `Applied role${
      rolesToApply.length !== 1 ? "s" : ""
    } ${roleMentions}!`,
    ephemeral: true,
  });
});

const userHasRole = (roleId: string, member: GuildMember | null): boolean =>
  member?.roles.cache.some((role) => role.id === roleId) ?? false;
