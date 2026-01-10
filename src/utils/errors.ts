import { DiscordAPIError } from 'discord.js'
import { DiscordAPIErrorMessagesByCode } from './constants/errors'

function isDiscordAPIError(error: unknown): error is DiscordAPIError {
    return error instanceof DiscordAPIError
}

function getDiscordErrorMessage(error: unknown): string | null {
    if (isDiscordAPIError(error)) {
        return DiscordAPIErrorMessagesByCode[error.code]
    }
    return null
}

export { isDiscordAPIError, getDiscordErrorMessage }