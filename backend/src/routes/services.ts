import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma';

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/services', async () => {
    return prisma.service.findMany();
  });
}