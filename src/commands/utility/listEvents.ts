import { SlashCommandBuilder, type CommandInteraction, GuildMember, type APIInteractionGuildMember, type CacheType } from 'discord.js'
import { QEventManager } from '../../utils'


export default {
	name: 'events',
	description: 'List all events in the server.',
	async data(): Promise<SlashCommandBuilder> {
		return new SlashCommandBuilder()
			.setName('events')
			.setDescription('List all events in the server.')
	},
	async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
		const EventManager = new QEventManager(interaction.client)
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		const member: GuildMember | APIInteractionGuildMember | null = interaction.member
		if (member === null) return

		let joinedAt: Date | null

		if (member instanceof GuildMember) {
			joinedAt = member.joinedAt
		} else {
			joinedAt = new Date()
		}
		EventManager.fetchGuildEvents()
		await interaction.reply(
			`This command was run by ${interaction.user.username}, who joined on ${joinedAt?.toISOString()}.`
		)
	}
}
