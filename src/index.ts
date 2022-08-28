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
  Tags.sync();
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
    return await sendRoleSelect(interaction);
  }
});

/**
 * Button handler
 */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "sendRoleMenu")
    return await sendRoleSelect(interaction);
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
