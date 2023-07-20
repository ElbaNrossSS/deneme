const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	], 
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] 
});

const fs = require('fs');
const config = require('./config.json');
require('dotenv').config() // remove this line if you are using replit

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.buttons = new Collection();
client.prefix = config.prefix;

module.exports = client;


fs.readdirSync('./handlers').forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});








//////////////////////Ticket Yeri ////////////////////////////////////////


const ticketSchema = require('./Schemas.js/ticketSchema');
const { ModalBuilder, TextInputBuilder, ButtonBuilder } = require("@discordjs/builders");
client.on(Events.InteractionCreate,async interaction =>{

    if (interaction.isButton()) return;
    if (interaction.isChatInputCommand()) return;

    const modal= new ModalBuilder()
    .setTitle('provide us with more information')
    .setCustomId('modal')

    const email = new TextInputBuilder()
    .setCustomId('email')
    .setRequired(true)
    .setLabel('provide us with your email')
    .setStyle(TextInputStyle.Short)

    const username = new TextInputBuilder()
    .setCustomId('username')
    .setRequired(true)
    .setLabel('provide us with your username')
    .setPlaceholder('this is your username')
    .setStyle(TextInputStyle.Short)

    const reason = new TextInputBuilder()
    .setCustomId('reason')
    .setRequired(true)
    .setLabel('the reason for this ticket')
    .setPlaceholder('give us a reason for opening this ticket')
    .setStyle(TextInputStyle.Short)
 

    const firstActionRow = new ActionRowBuilder().addComponents(email)
    const secondActionRow = new ActionRowBuilder().addComponents(username)
    const thirActionRow = new ActionRowBuilder().addComponents(reason)

    modal.addComponents(firstActionRow,secondActionRow,thirActionRow);

    let choices;
    if (interaction.isSelectMenu()) {

   choices = interaction.values;

const result = choices.join('');

  ticketSchema.findOne({Guild:interaction.Guild.id},async(err,data) => {

    const filter ={Guild:interaction.Guild.id};
    const update ={Ticket:result};


ticketSchema.updateOne(filter,update,{
    new:true
 }).then(value => {
     console.log(value)
 })

  })

}

if (interaction.isModalSubmit()) { 
    interaction.showModal(modal)
}


})

client.on(Event.InteractionCreate,async interaction => { 
    if (interaction.isModalSubmit()) { 
    if (interaction.customId == 'modal') {
        ticketSchema.findOne({Guild:interaction.guild.id}, async (err,data) => {
            const emailInput = interaction.fields.getTextInputValue('email')
            const usernameInput = interaction.fields.getTextInputValue('username')
            const reasonInput = interaction.fields.getTextInputValue('reason')
            const posChannel = await interaction.guild.Channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
            if (posChannel) return await interaction.reply({content:`you already have a ticket open - ${posChannel}`,ephemeral:true});
            const category = data.Channel;
            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${interaction.user.username}'s Ticket`)
            .setDescription(`Welcome to your ticket please wait while the staff review your information.`)
            .addFields({name:`Email`,value:`${emailInput}`})
            .addFields({name:`Username`,value:`${usernameInput}`})
            .addFields({name:`reason`,value:`${reasonInput}`})
            .addFields({name:`Type`,value:`${data.Ticket}`})
            .setFooter({text:`${interaction,guild.name} tickets`})

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger)
            )

            let channel = await interaction.guild.channelds.create({
                name: `ticket-${interaction.user.id}`,
                type:ChannelType.GuildText,
                parent:`${category}`
            })
   
            let msg = await channel.send({embeds:[embed],components:[button]});
            await interaction.reply({content:`your ticket is now open in ${channel}`,ephemeral:true});

            const collector = msg.createMessageComponentCollector()
            collector.on('collect',async i =>{
                ;(await channel).delete();

                const dmEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`your Ticket has been closed`)
                .setDescription(`Thanks for contacting us ıf you need anything else,feel free to create another ticket`)
                .setFooter({text:`${interaction,guild.name} tickets`})
                .setTimestamp()
               await interaction.member.send({embeds:{dmEmbed} }).catch(err=>{
                return;
            })

            })
        }
    )
    }

}
} )







client.login(process.env.TOKEN)
