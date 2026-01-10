import {
	Collection,
	GuildScheduledEvent,
	GuildScheduledEventEntityType,
	GuildScheduledEventPrivacyLevel,
	GuildScheduledEventStatus,
	type Guild,
	type GuildScheduledEventCreateOptions,
	type GuildScheduledEventEditOptions
} from 'discord.js'
import { type CustomClient } from '../utils/types/client'

type UpdateGuildEventOptions = GuildScheduledEventEditOptions<GuildScheduledEventStatus, GuildScheduledEventStatus.Active | GuildScheduledEventStatus.Completed | GuildScheduledEventStatus.Canceled>

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

	async createGuildEvent(options: GuildScheduledEventCreateOptions) {
		if (this.guildId === undefined) throw new Error(`GuildId not found with ID: ${this.guildId}`)

		try {
			const guild: Guild | undefined = this.client.guilds.cache.get(this.guildId)
			if (guild === undefined) throw new Error(`Guild not found with guildId: ${this.guildId}`)

			if (!options.scheduledEndTime && options.scheduledStartTime) {
				const startTime = new Date(options.scheduledStartTime);
				options.scheduledEndTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
			}

			const newEvent = await guild.scheduledEvents.create(options)
			return newEvent
		} catch (error) {
			console.error('Error creating guild event:', error)
			throw error
		}
	}

	async updateGuildEvent(eventId: string, options: UpdateGuildEventOptions) {
		if (this.guildId === undefined) throw new Error(`GuildId not found with ID: ${this.guildId}`)

		try {
			const guild: Guild | undefined = this.client.guilds.cache.get(this.guildId)
			if (guild === undefined) throw new Error(`Guild not found with guildId: ${this.guildId}`)

			if (!options.scheduledEndTime && options.scheduledStartTime) {
				const startTime = new Date(options.scheduledStartTime);
				options.scheduledEndTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
			}

			const updatedEvent = await guild.scheduledEvents.edit(eventId, options)
			return updatedEvent
		} catch (error) {
			console.error('Error updating guild event:', error)
			throw error
		}
	}

	async deleteGuildEvent(eventId: string) {
		if (this.guildId === undefined) throw new Error(`GuildId not found with ID: ${this.guildId}`)

		try {
			const guild: Guild | undefined = this.client.guilds.cache.get(this.guildId)
			if (guild === undefined) throw new Error(`Guild not found with guildId: ${this.guildId}`)

			await guild.scheduledEvents.delete(eventId)
		} catch (error) {
			console.error('Error deleting guild event:', error)
			throw error
		}
	}
}
