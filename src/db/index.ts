import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { and, eq } from "drizzle-orm";

const sqlite = new Database(process.env.DB_FILE_NAME!);
export const db = drizzle(sqlite, { schema, logger: true });

/**
 * Stores or updates a user's birthday in the database.
 * If the user does not exist, a new record is created.
 * If the user already exists, their birthday information is updated.
 *
 * @param userId The unique identifier for the user (e.g., Discord ID).
 * @param username The user's name.
 * @param day The day of the month of the birthday (1-31).
 * @param month The month of the birthday (1-12).
 * @param year The year of the birthday (optional).
 */
export const storeBirthday = async (
  userId: string,
  username: string,
  day: number,
  month: number,
  year: number | null,
) => {
  await db
    .insert(schema.users)
    .values({
      id: userId,
      username: username,
      birthdayDay: day,
      birthdayMonth: month,
      birthdayYear: year,
      joinedAt: new Date(), // Will only be set on initial creation
    })
    .onConflictDoUpdate({
      target: schema.users.id,
      set: {
        birthdayDay: day,
        birthdayMonth: month,
        birthdayYear: year,
        username: username, // Keep username in sync in case it changed
      },
    });
};

export const getBirthdayEventByUserId = async (userId: string) => {
  return await db.query.events.findFirst({
    where: and(
      eq(schema.events.userId, userId),
      eq(schema.events.type, "birthday"),
    ),
  });
};

export const storeBirthdayEvent = async (
  eventId: string,
  name: string,
  description: string,
  userId: string,
) => {
  return await db.insert(schema.events).values({
    id: eventId,
    name,
    description,
    userId,
    type: "birthday",
  });
};

export const updateBirthdayEvent = async (
  eventId: string,
  name: string,
  description: string,
) => {
  return await db
    .update(schema.events)
    .set({ name, description })
    .where(eq(schema.events.id, eventId));
};

export const deleteBirthdayEvent = async (eventId: string) => {
  return await db.delete(schema.events).where(eq(schema.events.id, eventId));
};

export const deleteUserBirthday = async (userId: string) => {
  return await db
    .update(schema.users)
    .set({ birthdayDay: null, birthdayMonth: null, birthdayYear: null })
    .where(eq(schema.users.id, userId));
};
