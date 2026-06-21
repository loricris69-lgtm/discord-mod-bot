const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-verifica')
    .setDescription('Pubblica il messaggio di verifica con bottone in questo canale')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x2ECC71)
      .setTitle('✅ Verifica account')
      .setDescription(
        'Benvenuto nel server!\n\nPer accedere a tutti i canali, premi il bottone qui sotto per confermare di essere una persona reale.'
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify_member')
        .setLabel('Verificami')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Messaggio di verifica pubblicato in questo canale.', ephemeral: true });
  }
};
