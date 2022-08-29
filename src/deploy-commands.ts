import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import environment from "./env";

const { clientId, token } = environment;

const commands = [
  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Select some roles!"),
  new SlashCommandBuilder()
    .setName("rolebinding")
    .setDescription("Manage your role menu bindings")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
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
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Update an existing role binding")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role you'd like to update")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("label")
            .setDescription("What to use as the title in the role menu")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("Category of the role")
            .setRequired(false)
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
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a role binding")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to delete the binding for")
            .setRequired(true)
        )
    ),
  new SlashCommandBuilder()
    .setName("admin")
    .setDescription("rolemon admin commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("button")
        .setDescription("Post a message with a button to set roles")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the button message in")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message to send with the button")
            .setRequired(false)
        )
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log("Successfully registered application commands"))
  .catch(console.error);
