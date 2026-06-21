const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avvisa un utente per un comportamento scorretto')
    .addUserOption(opt =>
      opt.setName('utente').setDescription('Utente da avvisare').setRequired(true))
    .addStringOption(opt =>
      opt.setName('motivo').setDescription('Motivo dell\'avviso').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('utente');
    const reason = interaction.options.getString('motivo');

    const embed = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle('⚠️ Avviso')
      .addFields(
        { name: 'Utente', value: `${target.tag} (${target.id})` },
        { name: 'Moderatore', value: interaction.user.tag },
        { name: 'Motivo', value: reason }
      )
      .setTimestamp();

    // Tenta di avvisare l'utente anche in privato
    try {
      await target.send(`⚠️ Sei stato avvisato nel server **${interaction.guild.name}** per: ${reason}`);
    } catch {
      // L'utente potrebbe avere i DM chiusi, non è un errore bloccante
    }

    await interaction.reply({ embeds: [embed] });
    await sendLog(interaction.guild, embed);
  }
};
