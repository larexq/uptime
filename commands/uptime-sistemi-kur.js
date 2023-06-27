const { EmbedBuilder, PermissionsBitField, getTextInputValue, TextInputBuilder, ButtonBuilder } = require("discord.js");
const db = require("croxydb");
const Discord = require("discord.js");

module.exports = {
    name: "uptime-sistemi-kur",
    description: 'Sunucunuza uptime sistemini kurarsınız.',
    type: 1,
    options: [
        {
            name: "kanal",
            description: "Sistem hangi kanala kurulsun?",
            type: 7,
            channel_types: [0],
            required: true
        }
    ],
    run: async (client, interaction) => {

        const kanal = interaction.options.getChannel("kanal");
        const sistem = db.fetch(`uptimesistem_${interaction.guild.id}`)

        if(!sistem) {
            interaction.reply({ content: "Sistem sunucunuza kuruluyor.", ephemeral: true })

            const embed = new EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle("Uptime Sistemi")
            .setDescription(`
            Link Eklemek İçin \`Ekle\` Butonuna Tıkla.
            Link Silmek İçin \`Sil\` Butonuna Tıkla.
            Linklerinin Listesini Görmek İçin \`Liste\` Butonuna Tıkla.
            `)

            const row = new Discord.ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel("Ekle")
                .setStyle(Discord.ButtonStyle.Success)
                .setCustomId("butonekle"),
                new ButtonBuilder()
                .setLabel("Sil")
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId("butonsil"),
                new ButtonBuilder()
                .setLabel("Liste")
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId("butonliste")
            )
            
            client.channels.cache.get(kanal.id).send({ embeds: [embed], components: [row] })
            db.set(`uptimesistem_${interaction.guild.id}`, kanal.id)
        }

        if(sistem) {
            interaction.reply({ content: "Uptime sistemi zaten sunucunuzda açık.\nSıfırlamak için `/uptime-sistemi-sıfırla`", ephemeral: true})
        }
     }
}