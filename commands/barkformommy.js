const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('barkformommy')
    .setDescription('🐶'),

  async execute(interaction) {
    await interaction.reply(`🐶 ${interaction.user} barked for mommy like a good boy`);
  }
};
