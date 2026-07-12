const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('praisegoodboy')
    .setDescription('🐶')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Chi è un bravo ragazzo?').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    await interaction.reply(`🐶 ${target} was called a good boy for mommy`);
  }
};
