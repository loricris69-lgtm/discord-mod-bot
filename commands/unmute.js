const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Rimuove il silenzio (timeout) da un utente')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Utente da riattivare').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: '❌ Utente non trovato nel server.', ephemeral: true });
    }

    try {
      await member.timeout(null);

      const embed = new EmbedBuilder()
        .setColor(0x2ECC71)
        .setTitle('🔊 Utente riattivato')
        .addFields(
          { name: 'Utente', value: `${target.tag} (${target.id})` },
          { name: 'Moderatore', value: interaction.user.tag }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      await sendLog(interaction.guild, embed);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Si è verificato un errore durante la rimozione del mute.', ephemeral: true });
    }
  }
};
