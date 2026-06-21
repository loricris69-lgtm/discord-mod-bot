const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banna un utente dal server')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Utente da bannare').setRequired(true))
    .addStringOption(opt =>
      opt.setName('motivo').setDescription('Motivo del ban').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';
    const member = interaction.guild.members.cache.get(target.id);

    if (member && !member.bannable) {
      return interaction.reply({ content: '❌ Non posso bannare questo utente (probabilmente ha un ruolo più alto del bot).', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(target.id, { reason });

      const embed = new EmbedBuilder()
        .setColor(0xE74C3C)
        .setTitle('🔨 Utente bannato')
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
      await interaction.reply({ content: '❌ Si è verificato un errore durante il ban.', ephemeral: true });
    }
  }
};
