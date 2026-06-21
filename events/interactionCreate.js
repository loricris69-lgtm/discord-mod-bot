module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Gestione del bottone "Verificami"
    if (interaction.isButton() && interaction.customId === 'verify_member') {
      return handleVerifyButton(interaction);
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`Errore nel comando ${interaction.commandName}:`, err);
      const errorReply = { content: '❌ Si è verificato un errore durante l\'esecuzione del comando.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorReply);
      } else {
        await interaction.reply(errorReply);
      }
    }
  }
};

async function handleVerifyButton(interaction) {
  const roleId = process.env.VERIFIED_ROLE_ID;

  if (!roleId) {
    return interaction.reply({ content: '❌ Il ruolo di verifica non è configurato (manca VERIFIED_ROLE_ID).', ephemeral: true });
  }

  const member = interaction.member;

  if (member.roles.cache.has(roleId)) {
    return interaction.reply({ content: '✅ Sei già verificato!', ephemeral: true });
  }

  try {
    await member.roles.add(roleId);
    await interaction.reply({ content: '✅ Verifica completata! Ora hai accesso a tutto il server.', ephemeral: true });
  } catch (err) {
    console.error('Errore durante la verifica:', err);
    await interaction.reply({ content: '❌ Non sono riuscito ad assegnarti il ruolo. Avvisa un moderatore.', ephemeral: true });
  }
}
