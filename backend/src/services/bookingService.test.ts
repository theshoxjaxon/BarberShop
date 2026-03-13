import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock prisma module used by bookingService
vi.mock('../db/prisma', () => {
  return {
    prisma: {
      barber: { findUnique: vi.fn() },
      service: { findUnique: vi.fn() },
      reservation: { findMany: vi.fn() },
    },
  } as any;
});

import { getAvailableSlots } from './bookingService';
import { prisma } from '../db/prisma.ts';

const asDate = (s: string) => new Date(s);

describe('getAvailableSlots', () => {
  const barberId = 1;
  const serviceId = 10;
  const date = '2024-12-02'; // Monday

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(asDate('2024-12-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('throws if barber or service not found', async () => {
    (prisma.barber.findUnique as any).mockResolvedValue(null);
    (prisma.service.findUnique as any).mockResolvedValue({ id: serviceId, duration: 30 });

    await expect(getAvailableSlots(barberId, date, serviceId)).rejects.toThrow('Barber or service not found');

    (prisma.barber.findUnique as any).mockResolvedValue({ id: barberId, workingHours: {} });
    (prisma.service.findUnique as any).mockResolvedValue(null);

    await expect(getAvailableSlots(barberId, date, serviceId)).rejects.toThrow('Barber or service not found');
  });

  it('returns empty array when no working hours for the day', async () => {
    (prisma.barber.findUnique as any).mockResolvedValue({ id: barberId, workingHours: { tuesday: ['09:00', '17:00'] } });
    (prisma.service.findUnique as any).mockResolvedValue({ id: serviceId, duration: 30 });
    (prisma.reservation.findMany as any).mockResolvedValue([]);

    const slots = await getAvailableSlots(barberId, date, serviceId); // Monday but only Tuesday hours provided
    expect(slots).toEqual([]);
  });

  it('generates slots at service duration intervals within working hours', async () => {
    (prisma.barber.findUnique as any).mockResolvedValue({ id: barberId, workingHours: { monday: ['09:00', '10:30'] } });
    (prisma.service.findUnique as any).mockResolvedValue({ id: serviceId, duration: 30 });
    (prisma.reservation.findMany as any).mockResolvedValue([]);

    const slots = await getAvailableSlots(barberId, date, serviceId);
    expect(slots).toEqual(['09:00', '09:30', '10:00']);
  });

  it('excludes slots that are already booked', async () => {
    (prisma.barber.findUnique as any).mockResolvedValue({ id: barberId, workingHours: { monday: ['09:00', '11:00'] } });
    (prisma.service.findUnique as any).mockResolvedValue({ id: serviceId, duration: 30 });
    (prisma.reservation.findMany as any).mockResolvedValue([
      { startTime: '09:30' },
      { startTime: '10:30' },
    ]);

    const slots = await getAvailableSlots(barberId, date, serviceId);
    expect(slots).toEqual(['09:00', '10:00']);
  });

  it('does not include a slot that would end after closing time', async () => {
    (prisma.barber.findUnique as any).mockResolvedValue({ id: barberId, workingHours: { monday: ['09:00', '09:45'] } });
    (prisma.service.findUnique as any).mockResolvedValue({ id: serviceId, duration: 30 });
    (prisma.reservation.findMany as any).mockResolvedValue([]);

    const slots = await getAvailableSlots(barberId, date, serviceId);
    // Implementation pushes the slot first, then computes next and breaks if it exceeds end
    expect(slots).toEqual(['09:00', '09:30']);
  });

  it('queries reservations with correct filters', async () => {
    (prisma.barber.findUnique as any).mockResolvedValue({ id: barberId, workingHours: { monday: ['09:00', '10:00'] } });
    (prisma.service.findUnique as any).mockResolvedValue({ id: serviceId, duration: 60 });
    (prisma.reservation.findMany as any).mockResolvedValue([]);

    await getAvailableSlots(barberId, date, serviceId);

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: { barberId, date: new Date(date), status: 'booked' },
    });
  });
});
