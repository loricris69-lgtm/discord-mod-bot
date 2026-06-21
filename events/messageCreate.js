const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

// Memorizza in memoria i messaggi recenti di ogni utente: Map<userId, timestamp[]>
const messageHistory = new Map();
// Evita di mandare in timeout due volte lo stesso utente nella stessa finestra
const recentlyPunished = new Set();

const MAX_MESSAGES = parseInt(process.env.ANTISPAM_MAX_MESSAGES || '5', 10);
const WINDOW_MS = parseInt(process.env.ANTISPAM_WINDOW_MS || '5000', 10);
const TIMEOUT_MINUTES = parseInt(process.env.ANTISPAM_TIMEOUT_MINUTES || '10', 10);

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignora bot, messaggi privati, e chi ha permessi di gestione messaggi (mod/admin)
    if (message.author.bot || !message.guild) return;
    if (message.member?.permissions.has('ManageMessages')) return;

    const userId = message.author.id;
    const now = Date.now();

    const timestamps = messageHistory.get(userId) || [];
    const recent = timestamps.filter(t => now - t < WINDOW_MS);
    recent.push(now);
    messageHistory.set(userId, recent);

    if (recent.length > MAX_MESSAGES && !recentlyPunished.has(userId)) {
      recentlyPunished.add(userId);
      setTimeout(() => recentlyPunished.delete(userId), WINDOW_MS * 2);

      try {
        // Cancella gli ultimi messaggi dell'utente nel canale corrente
        const fetched = await message.channel.messages.fetch({ limit: 50 });
        const userMessages = fetched.filter(m => m.author.id === userId).first(MAX_MESSAGES + 1);
        await message.channel.bulkDelete(userMessages, true).catch(() => {});

        // Applica un timeout automatico
        if (message.member?.moderatable) {
          await message.member.timeout(TIMEOUT_MINUTES * 60 * 1000, 'Anti-spam automatico');
        }

        const embed = new EmbedBuilder()
          .setColor(0x992D22)
          .setTitle('🚨 Spam rilevato')
          .addFields(
            { name: 'Utente', value: `${message.author.tag} (${userId})` },
            { name: 'Canale', value: `${message.channel}` },
            { name: 'Azione', value: `Messaggi cancellati e timeout di ${TIMEOUT_MINUTES} minuti` }
          )
          .setTimestamp();

        await sendLog(message.guild, embed);

        const warning = await message.channel.send(
          `⚠️ ${message.author} è stato silenziato per ${TIMEOUT_MINUTES} minuti per spam.`
        );
        setTimeout(() => warning.delete().catch(() => {}), 8000);
      } catch (err) {
        console.error('Errore nel sistema anti-spam:', err);
      }
    }
  }
};
