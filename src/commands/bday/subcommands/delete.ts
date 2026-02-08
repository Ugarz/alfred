import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    MessageFlags,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import {
    deleteBirthdayEvent,
    deleteUserBirthday,
    getAllBirthdays,
    getBirthdayEventByUserId,
} from "../../../db";
import { QEventManager } from "../../../events/eventsManager";

export const executeDelete = async (interaction: ChatInputCommandInteraction) => {
    const eventManager = new QEventManager(interaction.client);
    const targetUser = interaction.options.getUser("user");

    if (targetUser) {
        // Direct deletion
        try {
            const existingEvent = await getBirthdayEventByUserId(targetUser.id);

            if (existingEvent) {
                await eventManager.deleteGuildEvent(existingEvent.id);
                await deleteBirthdayEvent(existingEvent.id);
            }

            await deleteUserBirthday(targetUser.id);

            await interaction.reply({
                content: `🗑️ L'anniversaire de ${targetUser.username} a été supprimé.`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error("Error deleting birthday:", error);
            await interaction.reply({
                content: "❌ Une erreur est survenue lors de la suppression...",
                flags: MessageFlags.Ephemeral,
            });
        }
    } else {
        // Interactive selection
        try {
            const allBirthdays = await getAllBirthdays();

            if (!allBirthdays || allBirthdays.length === 0) {
                await interaction.reply({
                    content: "❌ Aucun anniversaire enregistré.",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            const options = allBirthdays.map((user) =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(user.username)
                    .setDescription(
                        `Anniversaire: ${user.birthdayDay}/${user.birthdayMonth}`,
                    )
                    .setValue(user.id),
            );

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("delete_birthday_select")
                .setPlaceholder("Sélectionnez un anniversaire à supprimer")
                .addOptions(options);

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenu,
            );

            const response = await interaction.reply({
                content: "Choisissez l'anniversaire à supprimer :",
                components: [row],
                flags: MessageFlags.Ephemeral,
            });

            try {
                const confirmation = await response.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    componentType: ComponentType.StringSelect,
                    time: 60000,
                });

                const selectedUserId = confirmation.values[0];
                const selectedUser = allBirthdays.find(
                    (u) => u.id === selectedUserId,
                );

                if (selectedUser) {
                    const existingEvent = await getBirthdayEventByUserId(
                        selectedUser.id,
                    );

                    if (existingEvent) {
                        await eventManager.deleteGuildEvent(existingEvent.id);
                        await deleteBirthdayEvent(existingEvent.id);
                    }

                    await deleteUserBirthday(selectedUser.id);

                    await confirmation.update({
                        content: `🗑️ L'anniversaire de ${selectedUser.username} a été supprimé.`,
                        components: [],
                    });
                } else {
                    await confirmation.update({
                        content: "❌ Utilisateur non trouvé.",
                        components: [],
                    });
                }
            } catch (e) {
                await interaction.editReply({
                    content:
                        "⏱️ Temps écoulé, aucune sélection n'a été faite.",
                    components: [],
                });
            }
        } catch (error) {
            console.error("Error fetching birthdays:", error);
            await interaction.reply({
                content:
                    "❌ Une erreur est survenue lors de la récupération des anniversaires.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
};
