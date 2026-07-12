const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rizz')
    .setDescription('😏')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Chi vuoi rizzare?').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    await interaction.reply(`😏 ${target} was rizzed and is now in love with ${interaction.user}`);
  }
};
