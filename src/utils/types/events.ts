import { Snowflake } from "discord.js";

export interface EventData {
  name: string;
  date: Date;
  participants: string[];
  reminders: Date[];
  channel: Snowflake;
  status: "planned" | "active" | "completed";
}
