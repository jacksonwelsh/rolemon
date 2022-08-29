import { Client, GuildMember, Intents } from "discord.js";
import environment from "./env";
import { getStructuredRoles, RoleType, sendRoleSelect } from "./roles";
import { Tags } from "./db";
import {
  handleCreateRoleBinding,
  handleDeleteRoleBinding,
  handleUpdateRoleBinding,
} from "./bindingManager";
import { sendIntentButton } from "./adminInteractions";
import { userHasRole } from "./util";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  Tags.sync({ alter: true });
  console.log("ready!");
});

client.login(environment.token);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "rolebinding") {
    if (interaction.options.getSubcommand() === "create") {
      return await handleCreateRoleBinding(interaction, client);
    } else if (interaction.options.getSubcommand() === "delete") {
      return await handleDeleteRoleBinding(interaction);
    } else if (interaction.options.getSubcommand() === "update") {
      return await handleUpdateRoleBinding(interaction, client);
    }
  } else if (interaction.commandName === "admin") {
    if (interaction.options.getSubcommand() === "button") {
      return await sendIntentButton(interaction, client);
    }
  }

  if (interaction.commandName === "roles") {
    if (interaction.options.getSubcommand() === "course") {
      return await sendRoleSelect(interaction, "course");
    }
    return await sendRoleSelect(interaction, "other");
  }
});

/**
 * Button handler
 */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "sendRoleMenu")
    return await sendRoleSelect(interaction, "course");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;
  if (!interaction.guildId)
    return interaction.reply({
      content: "Failed to assign roles.",
      ephemeral: true,
    });
  const roles = await getStructuredRoles(interaction.guildId);

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
      break;
    case "select-pronouns":
      roleClass = RoleType.PRONOUN;
      break;
    case "select-class":
      roleClass = RoleType.CLASS;
      break;
    case "select-other":
    default:
      roleClass = RoleType.OTHER;
  }

  const member: any = interaction.member as GuildMember;

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
