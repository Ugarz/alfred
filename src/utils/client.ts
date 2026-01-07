import * as dotenv from 'dotenv'

import { Client, Collection, GatewayIntentBits, type GuildScheduledEvent, type Snowflake, IntentsBitField } from 'discord.js'
import { type Command, type CustomClient } from './types/client'
dotenv.config()

export default function createClient(): CustomClient {
	if ((process.env.TOKEN === null) || process.env.TOKEN === undefined) throw new Error('Need a TOKEN')
	if ((process.env.ANNOUNCES_CHANNEL === null) || process.env.ANNOUNCES_CHANNEL === undefined) throw new Error('Need a ANNOUNCES_CHANNEL')

	const client: CustomClient = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildScheduledEvents,
			IntentsBitField.Flags.GuildMembers
		]
	})

	// Initiate a commands collection
	client.commands = new Collection<string, Command>()
	client.guildEvents = new Collection<Snowflake, GuildScheduledEvent>()
	client.guildId = process.env.GUILD_ID
	client.announcesChannel = client.channels.cache.get(process.env.ANNOUNCES_CHANNEL)

	client.login(process.env.TOKEN)
		.then(() => { console.log('Client logged in with token') })
		.catch(error => { console.error(error) })


	return client
}
