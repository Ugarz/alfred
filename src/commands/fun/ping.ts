import {
  MessageFlags,
  SlashCommandBuilder,
  type CommandInteraction,
} from "discord.js";

export default {
  name: "ping",
  description: "Replies with Pong!",
  async data(): Promise<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!");
  },
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: "Pong!",
      flags: MessageFlags.Ephemeral,
    });
  },
};
