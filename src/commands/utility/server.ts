import { SlashCommandBuilder, type CommandInteraction } from "discord.js";

export default {
  name: "server",
  description: "Provides information about the server.",
  async data(): Promise<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("server")
      .setDescription("Provides information about the server.");
  },
  async execute(interaction: CommandInteraction) {
    // interaction.guild is the object representing the Guild in which the command was run
    if (interaction.guild == null) return;
    await interaction.reply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
    );
  },
};
