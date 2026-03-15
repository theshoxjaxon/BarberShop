import TelegramBot from 'node-telegram-bot-api';
import { prisma } from '../db/prisma';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID!;
export const bot = new TelegramBot(token, { polling: true });

/**
 * Sends a rich HTML notification to the Admin with interactive buttons
 */
export const notifyAdmin = async (reservation: any) => {
  const notes = reservation.notes && reservation.notes.trim() !== '' ? reservation.notes : '-';
  
  const message = `
<b>NEW RESERVATION</b>
<b>Client:</b> ${reservation.clientName}
<b>Phone:</b> ${reservation.clientPhone}
<b>Barber:</b> ${reservation.barber?.name || 'N/A'}
<b>Service:</b> ${reservation.service?.name || 'N/A'}
<b>Date:</b> ${reservation.date}
<b>Time:</b> ${reservation.startTime}
<b>Notes:</b> ${notes}
  `;

  const options = {
    parse_mode: 'HTML' as const,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Confirm", callback_data: `confirm_${reservation.id}` },
          { text: "❌ Cancel", callback_data: `cancel_${reservation.id}` }
        ]
      ]
    }
  };

  await bot.sendMessage(adminChatId, message, options);
};

/**
 * Handle Admin Decisions (Confirm/Cancel)
 */
bot.on('callback_query', async (query) => {
  if (query.from.id.toString() !== adminChatId) {
    return bot.answerCallbackQuery(query.id, { text: "Unauthorized" });
  }

  const [action, resId] = query.data!.split('_');
  const status = action === 'confirm' ? 'confirmed' : 'cancelled';

  try {
    await prisma.reservation.update({
      where: { id: parseInt(resId) },
      data: { status }
    });

    await bot.editMessageText(`${query.message?.text}\n\n✅ <b>STATUS: ${status.toUpperCase()}</b>`, {
      chat_id: query.message?.chat.id,
      message_id: query.message?.message_id,
      parse_mode: 'HTML'
    });
    
    // TODO: Trigger Client SMS/Notification here
  } catch (error) {
    bot.answerCallbackQuery(query.id, { text: "Error updating database." });
  }
});

/**
 * Command: /today
 */
bot.onText(/\/today/, async (msg) => {
  if (msg.chat.id.toString() !== adminChatId) return;

  const todayStr = new Date().toISOString().split('T')[0];
  const bookings = await prisma.reservation.findMany({
    where: { 
        date: { contains: todayStr }, // Adjust based on your DateTime storage
        status: 'confirmed' 
    },
    orderBy: { startTime: 'asc' }
  });

  const list = bookings.length > 0 
    ? bookings.map(b => `🕒 ${b.startTime} - ${b.clientName}`).join('\n')
    : "No appointments confirmed for today.";

  bot.sendMessage(adminChatId, `<b>Today's Schedule:</b>\n${list}`, { parse_mode: 'HTML' });
});