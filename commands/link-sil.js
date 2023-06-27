const { EmbedBuilder, PermissionsBitField, getTextInputValue, TextInputBuilder } = require("discord.js");
const db = require("croxydb");
const Discord = require("discord.js");

module.exports = {
    name: "link-sil",
    description: 'Uptimedan link silersiniz.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const text = new Discord.TextInputBuilder()
        .setCustomId("linksilme")
        .setLabel(`Silmek İstediğiniz Uptime Linkinizi Giriniz.`)
        .setStyle(Discord.TextInputStyle.Paragraph)
        .setPlaceholder(`Linklerin:\n${db.fetch(`uptimelink_${interaction.user.id}`).join("\n")}`)
        .setRequired(true)

        const row = new Discord.ActionRowBuilder()
        .addComponents(text)

        const modal = new Discord.ModalBuilder()
        .setCustomId("linksilmeform")
        .setTitle("Link Sil")

        modal.addComponents(row)

        await interaction.showModal(modal)
     }
}