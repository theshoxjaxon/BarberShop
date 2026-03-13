import { FastifyInstance } from 'fastify';
import { getAvailableSlots } from '../services/bookingService';

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/slots', async (req, reply) => {
    const { barberId, date, serviceId } = req.query as any;
    if (!barberId || !date || !serviceId) return reply.status(400).send({ error: 'Missing params' });
    const slots = await getAvailableSlots(Number(barberId), date, Number(serviceId));
    return slots;
  });
}