import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  type CommandInteraction,
} from "discord.js";
import { executeAdd } from "./subcommands/add";
import { executeDelete } from "./subcommands/delete";

export default {
  name: "bday",
  description: "Manage birthdays",
  async data(): Promise<SlashCommandSubcommandsOnlyBuilder> {
    return new SlashCommandBuilder()
      .setName("bday")
      .setDescription("Manage birthdays")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Add or update a birthday")
          .addStringOption((option) =>
            option
              .setName("date")
              .setDescription("Birthday date (format: DD/MM or DD/MM/YYYY)")
              .setRequired(true),
          )
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("User (leave empty for yourself)")
              .setRequired(false),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("delete")
          .setDescription("Delete a birthday")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("User whose birthday to delete")
              .setRequired(false),
          ),
      );
  },
  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "add":
        await executeAdd(interaction as ChatInputCommandInteraction);
        break;
      case "delete":
        await executeDelete(interaction as ChatInputCommandInteraction);
        break;
      default:
        console.warn(`Unknown subcommand: ${subcommand}`);
    }
  },
};
