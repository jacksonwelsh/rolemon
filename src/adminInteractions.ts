import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, RESTJSONErrorCodes } from "discord-api-types/v9";
import {
  CacheType,
  Client,
  CommandInteraction,
  DiscordAPIError,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const BUTTON_DEFAULT_MESSAGE = "Click here to get your roles!";

export const sendIntentButton = async (
  interaction: CommandInteraction<CacheType>,
  client: Client
) => {
  const channel = interaction.options.getChannel("channel", false);
  const message = interaction.options.getString("message", false);

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("sendRoleMenu")
      .setLabel("Get Roles")
      .setStyle(MessageButtonStyles.PRIMARY)
  );

  const canonicalChannelId = channel?.id ?? interaction.channelId;

  try {
    if (channel) {
      await (client.channels.cache.get(canonicalChannelId) as TextChannel).send(
        {
          content: message ?? BUTTON_DEFAULT_MESSAGE,
          components: [row],
        }
      );
    } else {
      await interaction.channel?.send({
        content: message ?? BUTTON_DEFAULT_MESSAGE,
        components: [row],
      });
    }
  } catch (error) {
    const castedError = error as DiscordAPIError;
    if (castedError.code === RESTJSONErrorCodes.MissingPermissions) {
      return interaction.reply({
        content: `I don't have permissions to send messages in <#${canonicalChannelId}>!`,
        ephemeral: true,
      });
    }
  }

  return await interaction.reply({
    content: `Sent the roles button in <#${canonicalChannelId}>!`,
    ephemeral: true,
  });
};
