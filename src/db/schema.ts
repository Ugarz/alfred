// src/db/schema.ts
import { sql, relations } from 'drizzle-orm';
import { sqliteTable, unique, check, text, primaryKey,integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  birthdayDay: integer('birthday_day'),
  birthdayMonth: integer('birthday_month'),
  birthdayYear: integer('birthday_year'),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  karma: integer('karma').default(0),
}, (usersTable) => [
  unique('discord_username_idx').on(usersTable.username),
  check("birthday_day_check", sql`${usersTable.birthdayDay} >= 1 AND ${usersTable.birthdayDay} <= 31`),
  check("birthday_month_check", sql`${usersTable.birthdayMonth} >= 1 AND ${usersTable.birthdayMonth} <= 12`),
]);

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull().default('birthday'),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}));