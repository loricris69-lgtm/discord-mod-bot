const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goontojake')
    .setDescription('🤤'),

  async execute(interaction) {
    await interaction.reply(`🤤 ${interaction.user} gooned to jake`);
  }
};
