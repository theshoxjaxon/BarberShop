import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.barber.deleteMany();
  await prisma.barber.createMany({
    data: [
      {
        name: 'John Fade',
        photo: '',
        specialties: ['Fade', 'Classic'],
        workingHours: {
          monday: ['09:00', '18:00'],
          tuesday: ['09:00', '18:00'],
          wednesday: ['09:00', '18:00'],
          thursday: ['09:00', '18:00'],
          friday: ['09:00', '18:00'],
          saturday: ['10:00', '16:00'],
          sunday: []
        },
        yearsExperience: 5
      },
      {
        name: 'Mike Shear',
        photo: '',
        specialties: ['Shear', 'Beard'],
        workingHours: {
          monday: ['09:00', '18:00'],
          tuesday: ['09:00', '18:00'],
          wednesday: ['09:00', '18:00'],
          thursday: ['09:00', '18:00'],
          friday: ['09:00', '18:00'],
          saturday: ['10:00', '16:00'],
          sunday: []
        },
        yearsExperience: 8
      },
      {
        name: 'Anna Style',
        photo: '',
        specialties: ['Style', 'Color'],
        workingHours: {
          monday: ['09:00', '18:00'],
          tuesday: ['09:00', '18:00'],
          wednesday: ['09:00', '18:00'],
          thursday: ['09:00', '18:00'],
          friday: ['09:00', '18:00'],
          saturday: ['10:00', '16:00'],
          sunday: []
        },
        yearsExperience: 3
      }
    ]
  });
  console.log('Seeded barbers with years of experience.');
}

main().finally(() => prisma.$disconnect());
