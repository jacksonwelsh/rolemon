import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import environment from "./env";

const { clientId, guildIds, token } = environment;

const commands = [
  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Select some roles!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

guildIds.forEach((guildId) =>
  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands"))
    .catch(console.error)
);
