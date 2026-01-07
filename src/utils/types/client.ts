import {
	type Interaction,
	type Client,
	type Collection,
	type SlashCommandBuilder,
	type Snowflake,
	type GuildScheduledEvent,
	type Channel
} from 'discord.js'

export interface Command {
  name: string
  description: string
  aliases?: string[]
  data: () => Promise<SlashCommandBuilder>
  execute: (interaction: Interaction, args?: []) => void
}

export interface CustomClient extends Client {
  commands?: Collection<string, Command>
  guildEvents?: Collection<Snowflake, GuildScheduledEvent>
  guildId?: string
  announcesChannel?: Channel | null
}
