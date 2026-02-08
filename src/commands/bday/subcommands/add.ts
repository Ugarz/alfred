import {
    ChatInputCommandInteraction,
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventRecurrenceRuleFrequency,
    GuildScheduledEventRecurrenceRuleMonth,
    MessageFlags,
} from "discord.js";
import {
    getBirthdayEventByUserId,
    storeBirthday,
    storeBirthdayEvent,
    updateBirthdayEvent,
} from "../../../db";
import { QEventManager } from "../../../events/eventsManager";
import { getNextBirthday, validateAndParseDate } from "../../../utils/date";

export const executeAdd = async (interaction: ChatInputCommandInteraction) => {
    const eventManager = new QEventManager(interaction.client);
    const dateInput = interaction.options.getString("date", true);
    const targetUser = interaction.options.getUser("user") || interaction.user;

    const { date, error } = validateAndParseDate(dateInput);

    if (error || !date) {
        await interaction.reply({
            content: error || "❌ Une erreur inattendue est survenue.",
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    const { day, month, year } = date;

    try {
        await storeBirthday(
            targetUser.id,
            targetUser.username,
            day,
            month,
            year,
        );

        const existingEvent = await getBirthdayEventByUserId(targetUser.id);

        const nextBirthday = getNextBirthday(day, month);
        const eventName = `Anniversaire de ${targetUser.username} 🎂`;
        const eventDescription = `C'est l'anniversaire de ${targetUser.username} aujourd'hui ! 🎉`;

        if (existingEvent) {
            await eventManager.updateGuildEvent(existingEvent.id, {
                name: eventName,
                description: eventDescription,
                scheduledStartTime: nextBirthday,
            });
            await updateBirthdayEvent(
                existingEvent.id,
                eventName,
                eventDescription,
            );
            await interaction.reply({
                content: `🎂 J'ai mis à jour l'anniversaire de ${targetUser.username} pour le **${dateInput}** !`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            const newEvent = await eventManager.createGuildEvent({
                name: eventName,
                scheduledStartTime: nextBirthday,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                entityType: GuildScheduledEventEntityType.External,
                entityMetadata: { location: "Quelque part sur le serveur !" },
                description: eventDescription,
                recurrenceRule: {
                    frequency: GuildScheduledEventRecurrenceRuleFrequency.Yearly,
                    interval: 1,
                    startAt: nextBirthday,
                    byMonth: [
                        (nextBirthday.getMonth() +
                            1) as GuildScheduledEventRecurrenceRuleMonth,
                    ],
                    byMonthDay: [nextBirthday.getDate()],
                },
            });

            if (newEvent) {
                await storeBirthdayEvent(
                    newEvent.id,
                    newEvent.name,
                    newEvent.description || "",
                    targetUser.id,
                );
            }

            const displayName =
                targetUser.id === interaction.user.id
                    ? "ton"
                    : `l'anniversaire de ${targetUser.username}`;
            await interaction.reply({
                content: `🎂 J'ai enregistré ${displayName} anniversaire le **${dateInput}** !`,
                flags: MessageFlags.Ephemeral,
            });
        }
    } catch (error) {
        console.error("Error saving birthday:", error);
        await interaction.reply({
            content: "❌ Une erreur est survenue lors de l'enregistrement...",
            flags: MessageFlags.Ephemeral,
        });
    }
};
