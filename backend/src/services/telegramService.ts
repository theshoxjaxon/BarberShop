import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient, Reservation } from '@prisma/client';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID!;
const prisma = new PrismaClient();

// Initialize the bot
export const bot = new TelegramBot(token, { polling: true });

// State Machine for Admin Wizards (Add Barber)
const adminSession: Record<string, { step: 'AWAITING_NAME' | 'AWAITING_PHOTO', data?: any }> = {};

/**
 * 📢 NOTIFICATION: New Reservation Alert
 */
export async function notifyAdmin(reservation: Reservation & { barber: any, service: any }) {
  if (!adminChatId) {
    console.error('❌ TELEGRAM_ADMIN_CHAT_ID is missing in .env.');
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

  const keyboard = {
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Confirm', callback_data: `confirm_${reservation.id}` },
        { text: '❌ Cancel', callback_data: `cancel_${reservation.id}` }
      ]]
    },
    parse_mode: 'HTML' as const
  };

  bot.sendMessage(adminChatId, msg, keyboard)
    .then(() => console.log(`✅ Notification sent for #${reservation.id}`))
    .catch((err) => console.error('❌ Telegram Error:', err.message));
}

/**
 * 📅 COMMAND: /today
 */
bot.onText(/\/today/, async (msg) => {
  if (String(msg.chat.id) !== String(adminChatId)) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const reservations = await prisma.reservation.findMany({
    where: {
      date: { gte: today, lt: tomorrow },
      status: 'confirmed',
    },
    include: { barber: true, service: true },
    orderBy: { startTime: 'asc' }
  });

  if (!reservations.length) {
    return bot.sendMessage(adminChatId, 'No confirmed bookings for today. 💤');
  }

  let text = '<b>📅 Today\'s Confirmed Reservations:</b>\n\n';
  reservations.forEach(r => {
    text += `<b>${r.startTime}</b> - ${r.clientName} (${r.service.name})\n`;
  });

  bot.sendMessage(adminChatId, text, { parse_mode: 'HTML' });
});

/**
 * 🧔 COMMAND: /add_barber (Wizard Start)
 */
bot.onText(/\/add_barber/, (msg) => {
  if (String(msg.chat.id) !== String(adminChatId)) return;
  
  adminSession[msg.chat.id] = { step: 'AWAITING_NAME' };
  bot.sendMessage(msg.chat.id, "🧔 <b>Adding New Barber</b>\nPlease enter the barber's full name:", { parse_mode: 'HTML' });
});

/**
 * 📋 COMMAND: /list_barbers
 */
bot.onText(/\/list_barbers/, async (msg) => {
  if (String(msg.chat.id) !== String(adminChatId)) return;

  const barbers = await prisma.barber.findMany();
  if (!barbers.length) return bot.sendMessage(adminChatId, "No barbers found.");

  for (const b of barbers) {
    const opts = {
      parse_mode: 'HTML' as const,
      reply_markup: {
        inline_keyboard: [[{ text: `🗑️ Delete ${b.name}`, callback_data: `delete_barber_${b.id}` }]]
      }
    };
    await bot.sendMessage(adminChatId, `🧔 <b>${b.name}</b>`, opts);
  }
});

/**
 * ⌨️ MESSAGE LISTENER (Wizards & Replies)
 */
bot.on('message', async (msg) => {
  const session = adminSession[msg.chat.id];
  if (!session || msg.text?.startsWith('/')) return;

  if (session.step === 'AWAITING_NAME') {
    session.data = { name: msg.text };
    session.step = 'AWAITING_PHOTO';
    bot.sendMessage(msg.chat.id, `✅ Name set to: <b>${msg.text}</b>\nNow send a <b>Photo URL</b>:`, { parse_mode: 'HTML' });
  } 
  else if (session.step === 'AWAITING_PHOTO') {
    try {
      const newBarber = await prisma.barber.create({
        data: {
          name: session.data.name,
          photo: msg.text || 'default.jpg',
          workingHours: {
            monday: ["09:00", "18:00"], tuesday: ["09:00", "18:00"],
            wednesday: ["09:00", "18:00"], thursday: ["09:00", "18:00"],
            friday: ["09:00", "18:00"], saturday: ["10:00", "16:00"]
          }
        }
      });
      delete adminSession[msg.chat.id];
      bot.sendMessage(msg.chat.id, `🎉 <b>${newBarber.name}</b> has been added!`, { parse_mode: 'HTML' });
    } catch (e) {
      bot.sendMessage(msg.chat.id, "❌ Error saving barber.");
    }
  }
});

/**
 * 🖱️ CALLBACK HANDLER (Buttons)
 */
bot.on('callback_query', async (query) => {
  if (!query.data || String(query.message?.chat.id) !== String(adminChatId)) return;

  const data = query.data;

  // Handle Reservation Confirm/Cancel
  if (data.startsWith('confirm_') || data.startsWith('cancel_')) {
    const [, action, id] = data.match(/^(confirm|cancel)_(\d+)$/)!;
    const status = action === 'confirm' ? 'confirmed' : 'cancelled';

    const reservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status },
      include: { barber: true, service: true }
    });

    const resultMsg = `Reservation #${id} is <b>${status.toUpperCase()}</b>\n\n<b>👤 Client:</b> ${reservation.clientName}\n<b>💈 Barber:</b> ${reservation.barber.name}\n<b>⏰ Time:</b> ${reservation.startTime}`;
    
    bot.editMessageText(resultMsg, {
      chat_id: adminChatId,
      message_id: query.message?.message_id,
      parse_mode: 'HTML'
    });
    bot.answerCallbackQuery(query.id, { text: `Marked as ${status}` });
  }

  // Handle Barber Deletion
  if (data.startsWith('delete_barber_')) {
    const id = parseInt(data.replace('delete_barber_', ''));
    try {
      await prisma.barber.delete({ where: { id } });
      bot.editMessageText("🗑️ <i>Barber removed from system.</i>", {
        chat_id: adminChatId,
        message_id: query.message?.message_id,
        parse_mode: 'HTML'
      });
      bot.answerCallbackQuery(query.id, { text: "Barber deleted!" });
    } catch (e) {
      bot.answerCallbackQuery(query.id, { text: "Error: Check active reservations." });
    }
  }
});