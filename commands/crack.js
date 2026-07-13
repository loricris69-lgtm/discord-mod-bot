const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crack')
    .setDescription('😈')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Chi vuoi crackare?').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    await interaction.reply(`😈 ${target} was cracked by ${interaction.user}, willingly or not 😈`);
  }
};
