const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kys')
    .setDescription('💚')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Utente').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    await interaction.reply(`💚 ${target}, keep yourself safe!!`);
  }
};
