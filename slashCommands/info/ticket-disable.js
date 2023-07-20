const {PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } = require('discord.js');
const ticketSchema= require('../../Schemas.js/ticketSchema')

module.exports - {
  data: new SlashCommandBuilder()
 .setName('ticket-disable')
 .setDescription('This disables  the ticket message and system'),
  run: async (client, interaction) => {
   if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You must have admin to set up tickets", ephemeral:true})
     

   ticketSchema.deleteMany({ Guild: interaction.guild.id}, async (err, data) => {
    await interaction.reply({ content: "Your ticket system has been removed", ephemeral: true})
    
     })
     


    }
}