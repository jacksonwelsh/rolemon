import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import environment from "./env";

const { clientId, guildIds, token } = environment;

const commands = [
  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Select some roles!"),
  new SlashCommandBuilder()
    .setName("rolebindingcreate")
    .setDescription("Bind an existing role to a role menu")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role you'd like to add to a role menu")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("label")
        .setDescription("What to use as the title in the role menu")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Category of the role")
        .setRequired(true)
        .addChoices(
          {
            name: "1000 Course",
            value: "freshman",
          },
          {
            name: "2000 Course",
            value: "sophomore",
          },
          {
            name: "3000 Course",
            value: "junior",
          },
          {
            name: "4000 Course",
            value: "senior",
          },
          {
            name: "Graduate Course",
            value: "grad",
          },
          {
            name: "Pronoun Role",
            value: "pronoun",
          },
          {
            name: "Other Role",
            value: "other",
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription(
          "Longer description of the role, usually the course name"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("ID of the emoji to use")
        .setRequired(false)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

guildIds.forEach((guildId) =>
  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands"))
    .catch(console.error)
);
