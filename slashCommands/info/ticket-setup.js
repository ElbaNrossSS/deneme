const {PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } = require('discord.js');
const ticketSchema= require('../../Schemas.js/ticketSchema')

module.exports = {
  data: new SlashCommandBuilder()
 .setName('ticket-set')
 .setDescription('This sets up the ticket message and system')
 .addChannelOption(option => option.setName('channel').setDescription(`The channel you want to send the ticket message in`).addChannelTypes(ChannelType.GuildText).setRequired(true))
 .addChannelOption(option => option.setName('category').setDescription(`The category you want the tickets to be sent in`).addChannelTypes(ChannelType.GuildCategory).setRequired(true)),
  run: async (client, interaction) => {
   if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You must have admin to set up tickets", ephemeral:true})
    
   const channel = interaction.option.getChannel('channel')
   const category = interaction.option.getChannel('category')

    ticketSchema.findOne({Guild:interaction.Guild.id},async (err,data)=>{

    if (!data) {ticketSchema.create({
    Guild:interaction.Guild.id,
    Channel:category.id,
    Ticket:'first'
  })
  
  }else {await interaction.reply({content:"You already have a ticket massage set up. you can run /ticket-disable to remove it and testart"})
return;
}
const embed = new EmbedBuilder
.setcolor("Blue")
 .setTitle(`Ticket System`)
 .setDescription(`If you have a problem, open a ticket to talk to staff members!`)
 .setFooter({ text: `${interaction.guild.name} tickets`})

 const menu = new ActionRowBuilder()
 .addComponents(
    new SelectMenuBuilder()
    .setCustomId('select')
    .setMaxValues(1)
    .setPlaceholder("Select a topic...")
    .addOptions(
      {
            label: 'General Support',
            value:  'Subject: General Support'
    },
       {
            label:'Moderation Support',
            value: 'Subject: Moderation Support'
    },
    {
            label:'Server Support',
            value: 'Subject: Server Support'
    },
    {
            label:'Other',
            value: 'Subject: other'
     },
    )
 )
    await channel.send({ embeds: [embed], components: [menu] });
      await interaction.reply({content:`your ticket system has been set up in ${channel}`,ephemeral:true})
    
})


    }
}