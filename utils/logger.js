/**
 * Invia un embed al canale di log configurato, se presente.
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').EmbedBuilder} embed
 */
async function sendLog(guild, embed) {
  const logChannelId = process.env.LOG_CHANNEL_ID;
  if (!logChannelId) return;

  try {
    const channel = await guild.channels.fetch(logChannelId);
    if (channel && channel.isTextBased()) {
      await channel.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error('Impossibile inviare il log:', err.message);
  }
}

module.exports = { sendLog };
