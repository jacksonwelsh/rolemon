import {
  Client,
  Guild,
  GuildMember,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import environment from "./env";
import roles, { RoleClass } from "./roles";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("ready!");
});

client.login(environment.token);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "roles") {
    const freshmanRoles = roles.filter(
      (role) => role.class === RoleClass.FRESHMAN
    );
    const sophomoreRoles = roles.filter(
      (role) => role.class === RoleClass.SOPHOMORE
    );
    const juniorRoles = roles.filter((role) => role.class === RoleClass.JUNIOR);
    const seniorRoles = roles.filter((role) => role.class === RoleClass.SENIOR);
    const gradRoles = roles.filter((role) => role.class === RoleClass.GRAD);
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
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  let roleClass: RoleClass;

  switch (interaction.customId) {
    case "select-1000":
      roleClass = RoleClass.FRESHMAN;
      break;
    case "select-2000":
      roleClass = RoleClass.SOPHOMORE;
      break;
    case "select-3000":
      roleClass = RoleClass.JUNIOR;
      break;
    case "select-4000":
      roleClass = RoleClass.SENIOR;
      break;
    case "select-5000":
      roleClass = RoleClass.GRAD;
  }

  const member: any = interaction.member as GuildMember;

  const rolesToRemove = roles
    .filter((r) => r.class === roleClass)
    .filter((r) => !interaction.values.includes(r.value))
    .filter((r) => userHasRole(r.roleId, member as GuildMember))
    .map((r) => r.roleId);

  const rolesToApply = interaction.values.map(
    (value) => roles.find((r) => r.value === value)?.roleId
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
