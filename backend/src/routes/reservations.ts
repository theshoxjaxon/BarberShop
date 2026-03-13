import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma';
import { z } from 'zod';
import { notifyAdmin } from '../services/telegramService';

const ReservationSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+?\d{10,15}$/),
  barberId: z.number(),
  serviceId: z.number(),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional()
});

export default async function (fastify: FastifyInstance) {
  fastify.post('/api/reservations', async (req, reply) => {
    const body = ReservationSchema.safeParse(req.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid input' });

    const exists = await prisma.reservation.findFirst({
      where: {
        barberId: body.data.barberId,
        date: new Date(body.data.date),
        startTime: body.data.time,
        status: 'booked'
      }
    });
    if (exists) return reply.status(409).send({ error: 'Slot already booked' });

    const service = await prisma.service.findUnique({ where: { id: body.data.serviceId } });
    if (!service) return reply.status(404).send({ error: 'Service not found' });

    
    const [hours, minutes] = body.data.time.split(':').map(Number);
    const startAsMinutes = hours * 60 + minutes;
    const endAsMinutes = startAsMinutes + service.duration_minutes;
    
    const endHours = Math.floor(endAsMinutes / 60).toString().padStart(2, '0');
    const endMins = (endAsMinutes % 60).toString().padStart(2, '0');
    const endTime = `${endHours}:${endMins}`;

    const reservation = await prisma.reservation.create({
      data: {
        clientName: body.data.name,
        clientPhone: body.data.phone,
        barberId: body.data.barberId,
        serviceId: body.data.serviceId,
        date: new Date(body.data.date),
        startTime: body.data.time,
        endTime: endTime, // Now this is a valid string
        status: 'booked',
        notes: body.data.notes
      },
      include: { barber: true, service: true }
    });

    notifyAdmin(reservation);
    return { success: true, reservation };
  });
}