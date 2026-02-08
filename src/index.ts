import { readdirSync } from "node:fs";
import path from "node:path";
import {
  type Collection,
  Events,
  type GuildScheduledEvent,
  type GuildScheduledEventStatus,
  type Interaction,
  type CacheType,
  SlashCommandBuilder,
} from "discord.js";

import { type Command, type CustomClient } from "./utils/types/client";
import displayEvents from "./crons/display";
import { EXTENSION } from "./utils/constants/filetypes";
import createClient from "./utils/client";

const client: CustomClient = createClient();

client.on(
  Events.GuildScheduledEventCreate,
  (event: GuildScheduledEvent<GuildScheduledEventStatus>) => {
    console.log("======New event here");
    console.log(`New event ${JSON.stringify(event, null, 2)}`);
  },
);

client.on(Events.GuildScheduledEventUpdate, () => {
  console.log("Event updated");
});

client.on(Events.GuildScheduledEventUserAdd, () => {
  console.log("Event user added");
});

client.on(Events.GuildScheduledEventUserRemove, () => {
  console.log("Event user removed");
});

client.on(Events.GuildScheduledEventDelete, () => {
  console.log("Event deleted");
});

client.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection at:", reason);
});

(async () => {
  const foldersPath: string = path.join(__dirname, "commands");
  const commandFolders: string[] = readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath: string = path.join(foldersPath, folder);
    const commandFiles: string[] = readdirSync(commandsPath).filter(
      (file: string): boolean => file.endsWith(EXTENSION),
    );

    for (const file of commandFiles) {
      const filePath: string = path.join(commandsPath, file);
      const commandModule: { default: Command } = await import(filePath);
      const command: Command = commandModule.default;

      console.log(`command ${command.name}`, JSON.stringify(command));

      if ("data" in command && "execute" in command) {
        if (client.commands) {
          const data: SlashCommandBuilder = await command.data();
          console.log(`Loading command: ${data.name}`);
          client.commands.set(data.name, command);
          console.log(
            `Command ${data.name} set in client.commands. Size: ${client.commands.size}`,
          );
        }
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
})();

client.on(
  Events.InteractionCreate,
  async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;
    const client: CustomClient = interaction.client;
    const commands: Collection<string, Command> | undefined = client.commands;

    if (commands != undefined) {
      const command: Command | undefined = commands.get(
        interaction.commandName,
      );

      if (command === undefined) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }

      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    }
  },
);

client.once(Events.ClientReady, (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  const inviteLink = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot&permissions=${process.env.PERMISSIONS ? process.env.PERMISSIONS : 517573434433}`;
  console.log("Invite the bot", inviteLink);

  displayEvents(client as CustomClient);
});
