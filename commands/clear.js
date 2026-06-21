const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Cancella un numero di messaggi recenti dal canale')
    .addIntegerOption(opt =>
      opt.setName('numero').setDescription('Quanti messaggi cancellare (1-100)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('numero');

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: '❌ Devi specificare un numero tra 1 e 100.', ephemeral: true });
    }

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `🧹 Cancellati ${deleted.size} messaggi.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Errore durante la cancellazione (i messaggi più vecchi di 14 giorni non possono essere cancellati in blocco).', ephemeral: true });
    }
  }
};
