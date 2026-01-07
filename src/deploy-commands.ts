import * as dotenv from 'dotenv'
dotenv.config()

import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import { EXTENSION } from './utils/constants/filetypes'

import { type Command } from './utils/types/client'


async function deployCommands(): Promise<object[]> {
	const commands: object[] = []

	// Grab all the command files from the commands directory you created earlier
	const foldersPath: string = path.join(__dirname, 'commands')
	const commandFolders: string[] = fs.readdirSync(foldersPath)
	console.log('commandFolders', commandFolders)

	for (const folder of commandFolders) {

		const commandsPath: string = path.join(foldersPath, folder)
		const commandFiles: string[] = fs.readdirSync(commandsPath).filter((file : string): boolean => file.endsWith(EXTENSION))

		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath: string = path.join(commandsPath, file)
			try {
				const commandModule: { default: Command } = await import(filePath)
				if ('data' in commandModule.default && 'execute' in commandModule.default) {
					const commandData: SlashCommandBuilder = await commandModule.default.data()
					commands.push(commandData.toJSON())
				} else {
					console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
				}
			} catch (error) {
				console.error(`[ERROR] Failed to load command from ${filePath}:`, error)
			}
		}
	}
	return commands
}


if (!process.env.TOKEN) throw new Error('TOKEN not found')
// Construct and prepare an instance of the REST module
const http: REST = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async (): Promise<void> => {
	try {
		if (!process.env.CLIENT_ID || !process.env.GUILD_ID) throw new Error('CLIENT_ID or GUILD_ID not found')

		const commands = await deployCommands()
		console.log(`Started refreshing ${commands.length} application (/) commands.`)

		// The put method is used to fully refresh all commands in the guild with the current set
		await http.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		)

		console.log(`Successfully reloaded ${commands.length} application (/) commands.`)
	} catch (error) {
		// Improve error logging
		if (error instanceof Error) {
			console.error('Error while deploying commands:', error.message)
		} else {
			console.error('Unknown error while deploying commands:', error)
		}
		process.exit(1)
	}
})()
