# Agent Context

## Project Overview

This project is a Discord bot built boilerplate.
It provides utility commands and event management features.

## Tech Stack

- **Runtime**: Node.js (v24.13.0)
- **Language**: TypeScript
- **Framework**: discord.js (v14)
- **Database**: SQLite (better-sqlite3) with Drizzle ORM
- **Validation**: Zod
- **Scheduling**: croner
- **Task Runner**: mise
- **Package Manager**: pnpm

## Directory Structure

- `src/commands`: Slash commands organized by category (e.g., `utility`, `fun`).
- `src/crons`: Scheduled tasks (cron jobs).
- `src/db`: Database schema and client instance (`src/db/index.ts`, `src/db/schema.ts`).
- `src/events`: Event handlers and managers (e.g., `QEventManager`).
- `src/i18n`: Internationalization locale files.
- `src/utils`: Shared utilities, types, and constants.
- `src/index.ts`: Main entry point.
- `src/deploy-commands.ts`: Script to register slash commands with Discord.

## Key Concepts

### Commands

Commands are defined in `src/commands` as modules exporting a default object implementing the `Command` interface.
**Format**:

```typescript
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
  name: "commandName",
  description: "Description",
  async data() {
    return new SlashCommandBuilder()
      .setName("commandName")
      .setDescription("Description");
  },
  async execute(interaction: CommandInteraction) {
    // Logic
  },
};
```

### Database

- **ORM**: Drizzle ORM + `better-sqlite3`
- **Schema**: Defined in `src/db/schema.ts` (`users` and `events` tables).
- **Client**: Initiated in `src/db/index.ts`.
- **Migrations**: `drizzle-kit`.

### Internationalization

- Located in `src/i18n`.

### Events

- `src/events/eventsManager.ts` handles fetching and caching guild scheduled events.
- `src/index.ts` sets up event listeners for Discord events (e.g., `GuildScheduledEventCreate`).

### Cron Jobs

- Located in `src/crons`.
- Use `croner` for scheduling.
- Example: `src/crons/display.ts` sends weekly event summaries.

## Configuration

Environment variables are managed via `.env`. Required variables:

- `TOKEN`: Discord Bot Token
- `CLIENT_ID`: Application ID
- `GUILD_ID`: Server ID (for development/deployment)
- `ANNOUNCES_CHANNEL`: Channel ID for announcements
- `PERMISSIONS`: Bot invite permissions integer
- `DB_FILE_NAME`: SQLite database filename (default: `alfred.db`)

## Development Workflow

- **Start Dev Server**: `mise run dev` (uses `tsx watch` via `node --run`)
- **Build**: `mise run build` (uses `tsc`)
- **Deploy Commands**: `mise run deploy` (runs `src/deploy-commands.ts`)
- **Drizzle Studio**: `mise run studio` (inspect database UI)
- **Lint**: `pnpm lint`

## DB Migrations (Drizzle ORM)

- use `npx drizzle-kit generate` to generate new migrations
- use `npx drizzle-kit push` to apply migrations to the local database

## Code Quality & Complexity

- **Cyclomatic Complexity**: Keep functions small and focused. Avoid deep nesting and complex branching.
- **Single Responsibility**: Each module or function should have one reason to change. Separate subcommands into their own files.

## Conventions

- **Exports**: Use `export default` for command files.
- **Types**: Use `CustomClient` (extends `Client`) to access custom properties like `commands` and `guildEvents`.
- **Path Aliases**: Not currently configured (relative imports used).

## Discord API Resources

- [Discord API Reference](https://discord.com/developers/docs/intro)
- [Discord Best Practices](https://discord.com/developers/docs/rich-presence/best-practices)
- [Discord API Error Codes](https://discord.com/developers/docs/reference/error-codes)
- [Discord Events](https://discord.com/developers/docs/events/overview)
- [Discord.js Error Handling](https://discordjs.guide/legacy/popular-topics/errors)
