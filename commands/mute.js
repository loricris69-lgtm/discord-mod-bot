const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silenzia temporaneamente un utente (timeout)')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Utente da silenziare').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('minuti').setDescription('Durata del mute in minuti').setRequired(true))
    .addStringOption(opt =>
      opt.setName('motivo').setDescription('Motivo del mute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    const minutes = interaction.options.getInteger('minuti');
    const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: '❌ Utente non trovato nel server.', ephemeral: true });
    }
    if (!member.moderatable) {
      return interaction.reply({ content: '❌ Non posso silenziare questo utente (probabilmente ha un ruolo più alto del bot).', ephemeral: true });
    }
    if (minutes < 1 || minutes > 40320) {
      return interaction.reply({ content: '❌ La durata deve essere tra 1 minuto e 28 giorni (40320 minuti).', ephemeral: true });
    }

    try {
      await member.timeout(minutes * 60 * 1000, reason);

      const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle('🔇 Utente silenziato')
        .addFields(
          { name: 'Utente', value: `${target.tag} (${target.id})` },
          { name: 'Durata', value: `${minutes} minuti` },
          { name: 'Moderatore', value: interaction.user.tag },
          { name: 'Motivo', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      await sendLog(interaction.guild, embed);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Si è verificato un errore durante il mute.', ephemeral: true });
    }
  }
};
