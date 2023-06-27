const { EmbedBuilder, PermissionsBitField, getTextInputValue, TextInputBuilder, ButtonBuilder } = require("discord.js");
const db = require("croxydb");
const Discord = require("discord.js");

module.exports = {
    name: "uptime-sistemi-sıfırla",
    description: 'Sunucunuzdaki uptime sistemini sıfırlarsınız.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const sistem = db.fetch(`uptimesistem_${interaction.guild.id}`)

        if(!sistem) {
            interaction.reply({ content: "Sistem zaten kapalı\nAçmak için `/uptime-sistemi-kur`", ephemeral: true })
        }

        if(sistem) {
            db.delete(`uptimesistem_${interaction.guild.id}`)

            await interaction.reply({ content: "Uptime sistemi başarıyla sıfırlandı\nYeniden ayarlamak için `/uptime-sistemi-kur`", ephemeral: true})
        }
     }
    }