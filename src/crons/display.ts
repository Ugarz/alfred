import { Cron } from "croner";
import type { CustomClient } from "../utils/types/client";
import { QEventManager } from "../events/eventsManager";
import { EVERY_DAY } from "../utils/constants/crontimes";
import { getDiscordErrorMessage, isDiscordAPIError } from "../utils/errors";

export default function displayEvents(client: CustomClient): void {
  new Cron(EVERY_DAY, async () => {
    console.log("It's cron time");
    const eventManager = new QEventManager(client);
    const events = await eventManager.fetchGuildEvents();
    const channelId = process.env.ANNOUNCES_CHANNEL;
    if (!channelId) {
      console.error("ANNOUNCES_CHANNEL env var is not set");
      return;
    }
    const channel = client.channels.cache.get(channelId);

    if (!channel?.isSendable()) {
      console.log("Channel not found or is not sendable");
      return;
    }

    if (events != null && events.size === 0) {
      try {
        await channel.send(
          "No events planned for this week.\nHave a great week! ✨",
        );
      } catch (error: unknown) {
        if (isDiscordAPIError(error)) {
          console.error(getDiscordErrorMessage(error));
        }
      }
      return;
    }

    events.forEach(async (event) => {
      const {
        name,
        description,
        scheduledStartTimestamp,
        userCount,
        creator,
        url,
      } = event;
      const message = `
				Here are the events for the week:
				Title: ${name}
				Description: ${description}
				Scheduled Start Timestamp: ${scheduledStartTimestamp}
				User Count: ${userCount}
				Creator: ${creator}
				link: ${url}`;
      console.log("message", message);
    });
  });
}
