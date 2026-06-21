const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Espelle un utente dal server')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Utente da espellere').setRequired(true))
    .addStringOption(opt =>
      opt.setName('motivo').setDescription('Motivo dell\'espulsione').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: '❌ Utente non trovato nel server.', ephemeral: true });
    }
    if (!member.kickable) {
      return interaction.reply({ content: '❌ Non posso espellere questo utente (probabilmente ha un ruolo più alto del bot).', ephemeral: true });
    }

    try {
      await member.kick(reason);

      const embed = new EmbedBuilder()
        .setColor(0xE67E22)
        .setTitle('👋 Utente espulso')
        .addFields(
          { name: 'Utente', value: `${target.tag} (${target.id})` },
          { name: 'Moderatore', value: interaction.user.tag },
          { name: 'Motivo', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      await sendLog(interaction.guild, embed);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Si è verificato un errore durante l\'espulsione.', ephemeral: true });
    }
  }
};
