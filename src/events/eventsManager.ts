import { Collection, GuildScheduledEvent, GuildScheduledEventStatus, type Guild } from 'discord.js'
import { type CustomClient } from '../utils/types/client'

export class QEventManager {
	private readonly client: CustomClient
	private readonly guildId: string | undefined

	constructor (client: CustomClient) {
		this.client = client
		this.guildId = client.guildId
	}


	async fetchGuildEvents() {
		if (this.guildId === undefined) throw new Error(`GuildId not found with ID: ${this.guildId}`)

		try {
			const guild: Guild | undefined = this.client.guilds.cache.get(this.guildId)
			if (guild === undefined) throw new Error(`Guild not found with guildId: ${this.guildId}`)

			const events: Collection<string, GuildScheduledEvent<GuildScheduledEventStatus>> = await guild.scheduledEvents.fetch()
			this.client.guildEvents = events
			return events
		} catch (error) {
			console.error('Error fetching guild events:', error)
			throw error
		}
	}
}
