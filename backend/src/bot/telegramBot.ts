import { Message } from 'node-telegram-bot-api'; // Add this import
import { bot } from '../services/telegramService';
import { prisma } from '../db/prisma';
import { startOfDay, endOfDay } from 'date-fns';

bot.onText(/\/today/, async (msg: Message) => { // Type the 'msg'
  const chatId = msg.chat.id;
  const now = new Date();

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
        status: 'booked'
      },
      include: { barber: true, service: true },
    });

    if (reservations.length === 0) {
      return bot.sendMessage(chatId, "No bookings for today. 🧊");
    }

    let messageText = "<b>📅 Today's Schedule:</b>\n\n";
    // ... rest of your formatting logic
    bot.sendMessage(chatId, messageText, { parse_mode: 'HTML' });
    
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "⚠️ Database connection error.");
  }
});