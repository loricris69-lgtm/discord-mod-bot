const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('grape')
    .setDescription('🍇')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Chi vuoi grapare?').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    await interaction.reply(`🍇 ${target} was graped`);
  }
};
