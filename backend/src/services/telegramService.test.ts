import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock environment variables before importing the module
const OLD_ENV = { ...process.env } as Record<string, string | undefined>;

// Mock node-telegram-bot-api
const sendMessage = vi.fn();
vi.mock('node-telegram-bot-api', () => {
  return {
    default: vi.fn().mockImplementation((_token: string, _opts: any) => ({
      sendMessage,
    })),
  };
});

beforeEach(() => {
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  process.env.TELEGRAM_ADMIN_CHAT_ID = '1234';
});

afterEach(() => {
  // cleanup env and mocks between tests
  Object.assign(process.env, OLD_ENV);
  vi.resetModules();
  vi.clearAllMocks();
});

describe('telegramService.notifyAdmin', () => {
  it('formats and sends an admin notification message', async () => {
    // Re-import module after env and mocks are set
    const { notifyAdmin } = await import('./telegramService');

    const reservation = {
      clientName: 'John Doe',
      clientPhone: '+1-555-0100',
      barber: { name: 'Alex' },
      service: { name: 'Haircut' },
      date: '2024-12-02',
      startTime: '14:30',
      notes: 'Please be on time',
    };

    notifyAdmin(reservation);

    expect(sendMessage).toHaveBeenCalledTimes(1);
    const [chatId, msg, options] = sendMessage.mock.calls[0];
    expect(chatId).toBe('1234');
    expect(String(msg)).toContain('<b>NEW RESERVATION</b>');
    expect(String(msg)).toContain('Client: John Doe');
    expect(String(msg)).toContain('Phone: +1-555-0100');
    expect(String(msg)).toContain('Barber: Alex');
    expect(String(msg)).toContain('Service: Haircut');
    expect(String(msg)).toContain('Date: 2024-12-02');
    expect(String(msg)).toContain('Time: 14:30');
    expect(String(msg)).toContain('Notes: Please be on time');
    expect(options).toEqual({ parse_mode: 'HTML' });
  });

  it('uses dash for empty notes', async () => {
    const { notifyAdmin } = await import('./telegramService');
    const reservation = {
      clientName: 'Jane',
      clientPhone: '000',
      barber: { name: 'Max' },
      service: { name: 'Beard' },
      date: '2024-12-03',
      startTime: '09:00',
      notes: '',
    };

    notifyAdmin(reservation);

    const [_chatId, msg] = sendMessage.mock.calls.at(-1)!;
    expect(String(msg)).toContain('Notes: -');
  });
});
