import * as TelegramBot from 'node-telegram-bot-api';

// Use ! only if you are 100% sure these exist in .env
const token = process.env.TELEGRAM_BOT_TOKEN!;
const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID!;
// Initialize the bot instance
// Setting polling to true allows the bot to listen for commands like /today
export const bot = new TelegramBot(token, { polling: true });

/**
 * Notifies the admin via Telegram when a new reservation is created.
 * @param reservation - The reservation object including joined barber and service data.
 */
export function notifyAdmin(reservation: any) {
  if (!adminChatId) {
    console.error('❌ TELEGRAM_ADMIN_CHAT_ID is missing in .env. Notification not sent.');
    return;
  }

  const msg = `
<b>🔔 NEW RESERVATION</b>

<b>👤 Client:</b> ${reservation.clientName}
<b>📞 Phone:</b> <code>${reservation.clientPhone}</code>
<b>💈 Barber:</b> ${reservation.barber.name}
<b>✂️ Service:</b> ${reservation.service.name}
<b>📅 Date:</b> ${new Date(reservation.date).toLocaleDateString()}
<b>⏰ Time:</b> ${reservation.startTime}
<b>📝 Notes:</b> ${reservation.notes || '-'}
  `.trim();

  bot.sendMessage(adminChatId, msg, { parse_mode: 'HTML' })
    .then(() => console.log(`✅ Notification sent to admin for reservation #${reservation.id}`))
    .catch((err) => console.error('❌ Telegram Notification Error:', err.message));
}