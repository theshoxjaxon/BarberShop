import { prisma } from '../db/prisma';
import { addMinutes, format, parse } from 'date-fns';

/**
 * Generates available booking slots by cross-referencing working hours,
 * service duration, and existing reservations.
 */
export async function getAvailableSlots(
  barberId: number, 
  date: string, 
  serviceId: number
): Promise<string[]> {
  // 1. Fetch barber and service details
  const barber = await prisma.barber.findUnique({ where: { id: barberId } });
  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!barber || !service) {
    throw new Error('Barber or service not found');
  }

  // 2. Resolve working hours for the requested day
  const dayOfWeek = format(new Date(date), 'eeee').toLowerCase();
  
  // Safe cast for JSON fields from Prisma
  const workingHoursMap = barber.workingHours as Record<string, string[]>;
  const hours = workingHoursMap[dayOfWeek];

  // If no hours defined or shop is closed that day, return empty
  if (!hours || hours.length < 2) return [];

  const [openTime, closeTime] = hours; 
  const availableSlots: string[] = [];
  
  let currentStr = openTime;
  const stepIntervalMinutes = 30; 

  // 3. Generate potential slots based on availability windows
  while (currentStr < closeTime) {
    const slotStart = parse(currentStr, 'HH:mm', new Date(date));
    const slotEnd = addMinutes(slotStart, service.durationMinutes);
    const slotEndStr = format(slotEnd, 'HH:mm');

    // Only add if the service duration doesn't bleed past closing time
    if (slotEndStr <= closeTime) {
      availableSlots.push(currentStr);
    }

    // Advance the pointer by the step interval (e.g., every 30 mins)
    const nextStep = addMinutes(slotStart, stepIntervalMinutes);
    currentStr = format(nextStep, 'HH:mm');

    if (currentStr >= closeTime) break;
  }

  // 4. Filter out slots that overlap with existing reservations
  const reservations = await prisma.reservation.findMany({
    where: { 
      barberId, 
      date: new Date(date), 
      status: 'booked' 
    },
    select: {
      startTime: true // Using 'select' ensures TypeScript knows the shape of 'r'
    }
  });

  const bookedTimes: string[] = reservations.map((res) => res.startTime);

  // Return the final list of free slots
  return availableSlots.filter((slot) => !bookedTimes.includes(slot));
}