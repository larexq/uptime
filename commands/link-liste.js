const { EmbedBuilder, PermissionsBitField, getTextInputValue, TextInputBuilder } = require("discord.js");
const db = require("croxydb");
const Discord = require("discord.js");

module.exports = {
    name: "link-liste",
    description: 'Uptimedeki linklerinize bakarsınız.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const link = db.fetch(`uptimelink_${interaction.user.id}`)

        if(!link || link.length === 0) return interaction.reply({ content: "Sisteme hiç link eklememişsin." })
       
        const embed = new Discord.EmbedBuilder()
            .setTitle('Link Listesi')
            .setDescription(`${link.join("\n")}`)
            await interaction.reply({ embeds: [embed], ephemeral: true })
     }
}