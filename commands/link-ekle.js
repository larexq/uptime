const { EmbedBuilder, PermissionsBitField, getTextInputValue, TextInputBuilder } = require("discord.js");
const db = require("croxydb");
const Discord = require("discord.js");

module.exports = {
    name: "link-ekle",
    description: 'Uptimeye link eklersiniz.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const text = new Discord.TextInputBuilder()
        .setCustomId("linkekleme")
        .setLabel(`Uptime Linkinizi Giriniz.`)
        .setStyle(Discord.TextInputStyle.Paragraph)
        .setPlaceholder(`https://projeniz.glitch.me`)
        .setRequired(true)

        const row = new Discord.ActionRowBuilder()
        .addComponents(text)

        const modal = new Discord.ModalBuilder()
        .setCustomId("linkeklemeform")
        .setTitle("Link Ekle")

        modal.addComponents(row)

        await interaction.showModal(modal)
     }
}