const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goontomenial')
    .setDescription('🤤'),

  async execute(interaction) {
    await interaction.reply(`🤤 ${interaction.user} gooned to menial`);
  }
};
