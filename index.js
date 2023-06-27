const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch");

const client = new Client({
    intents: Object.values(Discord.IntentsBitField.Flags),
    partials: Object.values(Partials)
});

const PARTIALS = Object.values(Partials);
const db = require("croxydb");
const config = require("./config.json");
const chalk = require("chalk");

global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs");
const interactionCreate = require("./events/interactionCreate");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(chalk.red`[COMMAND]` + ` ${props.name} komutu yüklendi.`)

});

readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(chalk.blue`[EVENT]` + ` ${name} eventi yüklendi.`)
});

client.login(config.token)
client.setMaxListeners(50)

process.on("uncaughtException", async (error) => {
  return console.log("Bir hata oluştu! " + error)
})

  //------------------------------Link Aktif Etme-----------------------------------\\

  client.on("ready", async ()=> {

    const links = db.get("uptimelink");
    if (!links) return;
    links.forEach((link) => {
      try {
        fetch(link);
      } catch (error) {
        console.log("Hata: " + error);
      }
    });
  
    console.log(chalk.bgMagenta`[UPTIME]` + ` Linkler uptime ediliyor.`)

    const embed = new Discord.EmbedBuilder()
    .setTitle("Uptime Ediliyor")
    .setDescription(`\`${links.length}\` tane link uptime edilmeye başlandı.`)

    client.channels.cache.get(config.bildirimkanalid).send({ embeds: [embed] })
    
  })
  
setInterval(() => {
    const links = db.get("uptimelink");
    if (!links) return;
    links.forEach((link) => {
      try {
        fetch(link);
      } catch (error) {
        console.log("Hata: " + error);
      }
    });
  
    console.log(chalk.bgMagenta`[UPTIME]` + ` Linkler uptime ediliyor.`)

    const embed = new Discord.EmbedBuilder()
    .setTitle("Uptime Ediliyor")
    .setDescription(`\`${links.length}\` tane link uptime edilmeye başlandı.`)

    client.channels.cache.get(config.bildirimkanalid).send({ embeds: [embed] })
  }, 120000);

  //------------------------------Link Ekleme-----------------------------------\\

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'linkeklemeform') {

        const link = interaction.fields.getTextInputValue("linkekleme")
        const linkvar = db.fetch(`uptimelink_${interaction.user.id}`, []);

        if(!link) return;
        if(linkvar.includes(link)) return interaction.reply({ content: "Bu link zaten daha önce eklenmiş." })
        if(!link.startsWith("https://")) return interaction.reply({ content: "Link \"https://\" ile başlamalıdır." })

        if(!link.endsWith(".glitch.me") && !link.endsWith(".glitch.me/") && !link.endsWith(".repl.co") && !link.endsWith(".reply.co/")) return interaction.reply({ content: "Linkin sonu \".glitch.me\" veya \".repl.co\" ile bitmelidir." })

        db.push(`uptimelink_${interaction.user.id}`, link);
        db.push(`uptimelink`, link);

        const embed = new EmbedBuilder()
        .setTitle("Bir Link Eklendi")
        .setDescription(`<@${interaction.user.id}> kullanıcısı bir link ekledi.\nToplam \`${db.fetch(`uptimelink_${interaction.user.id}`).length}\` tane linki oldu.`)
        await interaction.reply({ embeds: [embed] })
    }
  })

    //------------------------------Link Silme-----------------------------------\\

    client.on("interactionCreate", async (interaction) => {
        if(!interaction.isModalSubmit()) return;
        if(interaction.customId === 'linksilmeform') {

            const links = db.get(`uptimelink_${interaction.user.id}`)
            const link = interaction.fields.getTextInputValue("linksilme")

            if(!links.includes(link)) return interaction.reply({ content: `Senin böyle eklediğin bir link yok.` })

            db.unpush(`uptimelink_${interaction.user.id}`, link)
            db.unpush(`uptimelink`, link)

            const embed = new EmbedBuilder()
            .setTitle("Bir Link Silindi")
            .setDescription(`<@${interaction.user.id}> kullanıcısı bir link sildi.\nToplam \`${db.fetch(`uptimelink_${interaction.user.id}`).length}\` tane linki kaldı.`)
            await interaction.reply({ embeds: [embed] })
        }
    })

    //------------------------------Sunucuya Özel Uptime Sistemi-----------------------------------\\

    client.on("interactionCreate", async (interaction) => {
      if(interaction.customId === "butonekle") {

        const text = new Discord.TextInputBuilder()
        .setCustomId("sunuculinkekleme")
        .setLabel(`Uptime Linkinizi Giriniz.`)
        .setStyle(Discord.TextInputStyle.Paragraph)
        .setPlaceholder(`https://projeniz.glitch.me`)
        .setRequired(true)

        const row = new Discord.ActionRowBuilder()
        .addComponents(text)

        const modal = new Discord.ModalBuilder()
        .setCustomId("sunuculinkeklemeform")
        .setTitle("Link Ekle")

        modal.addComponents(row)

        await interaction.showModal(modal)
    }

    client.on("interactionCreate", async (interaction) => {
      if(!interaction.isModalSubmit()) return;
      if(interaction.customId === 'sunuculinkeklemeform') {

      const link = interaction.fields.getTextInputValue("sunuculinkekleme")
      const linkvar = db.fetch(`uptimelink_${interaction.user.id}`, []);

      if(!link) return;
      if(linkvar.includes(link)) return interaction.reply({ content: "Bu link zaten daha önce eklenmiş.", ephemeral: true })
      if(!link.startsWith("https://")) return interaction.reply({ content: "Link \"https://\" ile başlamalıdır.", ephemeral: true })

      if(!link.endsWith(".glitch.me") && !link.endsWith(".glitch.me/") && !link.endsWith(".repl.co") && !link.endsWith(".reply.co/")) return interaction.reply({ content: "Linkin sonu \".glitch.me\" veya \".repl.co\" ile bitmelidir.", ephemeral: true })

      db.push(`uptimelink_${interaction.user.id}`, link);
      db.push(`uptimelink`, link);

      const embed = new EmbedBuilder()
      .setTitle("Bir Link Eklendi")
      .setDescription(`<@${interaction.user.id}> kullanıcısı bir link ekledi.\nToplam \`${db.fetch(`uptimelink_${interaction.user.id}`).length}\` tane linki oldu.`)
      await interaction.reply({ embeds: [embed], ephemeral: true })
    }
    })

    client.on("interactionCreate", async (interaction) => {
      if(interaction.customId === "butonsil") {

        const text = new Discord.TextInputBuilder()
        .setCustomId("sunuculinksilme")
        .setLabel(`Silmek İstediğiniz Uptime Linkinizi Giriniz.`)
        .setStyle(Discord.TextInputStyle.Paragraph)
        .setPlaceholder(`Linklerin:\n${db.fetch(`uptimelink_${interaction.user.id}`).join("\n")}`)
        .setRequired(true)

        const row = new Discord.ActionRowBuilder()
        .addComponents(text)

        const modal = new Discord.ModalBuilder()
        .setCustomId("sunuculinksilmeform")
        .setTitle("Link Sil")

        modal.addComponents(row)

        await interaction.showModal(modal)
    }
    })

    client.on("interactionCreate", async (interaction) => {
      if(!interaction.isModalSubmit()) return;
      if(interaction.customId === 'sunuculinksilmeform') {

      const links = db.get(`uptimelink_${interaction.user.id}`)
      const link = interaction.fields.getTextInputValue("sunuculinksilme")

      if(!links.includes(link)) return interaction.reply({ content: `Senin böyle eklediğin bir link yok.`, ephemeral: true })
      
      else{

      db.unpush(`uptimelink_${interaction.user.id}`, link)
      db.unpush(`uptimelink`, link)

      const embed = new EmbedBuilder()
      .setTitle("Bir Link Silindi")
      .setDescription(`<@${interaction.user.id}> kullanıcısı bir link sildi.\nToplam \`${db.fetch(`uptimelink_${interaction.user.id}`).length}\` tane linki kaldı.`)
      await interaction.reply({ embeds: [embed], ephemeral: true })
      }
    }
    })

    client.on("interactionCreate", async (interaction) => {

      if(interaction.customId === "butonliste") {

        const link = db.fetch(`uptimelink_${interaction.user.id}`)

        if(!link || link.length === 0) return interaction.reply({ content: "Sisteme hiç link eklememişsin.", ephemeral: true })
       
        const embed = new Discord.EmbedBuilder()
            .setTitle('Link Listesi')
            .setDescription(`${link.join("\n")}`)
            return interaction.reply({ embeds: [embed], ephemeral: true })
      }
    })
    })