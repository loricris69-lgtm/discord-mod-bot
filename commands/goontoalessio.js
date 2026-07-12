const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goontoalessio')
    .setDescription('🤤'),

  async execute(interaction) {
    await interaction.reply(`🤤 ${interaction.user} gooned to alessio`);
  }
};
