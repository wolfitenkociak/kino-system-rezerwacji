import { PrismaClient } from '@prisma/client';
// We'll use a more compatible way to hash passwords
import crypto from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    // Generate a salt
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Hash the password with PBKDF2
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

async function main() {
  try {
    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin',
        password: adminPassword,
        isAdmin: true,
      }
    });
    
    console.log(`Created admin user: ${admin.email}`);
    
    // Create sample movies
    const movies = [
      {
        title: 'The Matrix Resurrections',
        description: 'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, Neo will have to choose to follow the white rabbit once more.',
        duration: 148,
        imageUrl: 'https://example.com/matrix.jpg',
        releaseDate: new Date('2021-12-22'),
      },
      {
        title: 'Dune',
        description: 'Feature adaptation of Frank Herbert\'s science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
        duration: 155,
        imageUrl: 'https://example.com/dune.jpg',
        releaseDate: new Date('2021-10-22'),
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
        duration: 148,
        imageUrl: 'https://example.com/spiderman.jpg',
        releaseDate: new Date('2021-12-17'),
      }
    ];
    
    for (const movie of movies) {
      const createdMovie = await prisma.movie.create({
        data: movie,
      });
      console.log(`Created movie: ${createdMovie.title}`);
      
      // Create some screenings for this movie
      const dates = [
        new Date('2025-04-10T18:00:00Z'),
        new Date('2025-04-10T21:00:00Z'),
        new Date('2025-04-11T18:00:00Z'),
        new Date('2025-04-11T21:00:00Z'),
      ];
      
      for (const date of dates) {
        await prisma.screening.create({
          data: {
            movieId: createdMovie.id,
            date,
            hall: `Hall ${Math.floor(Math.random() * 5) + 1}`,
          }
        });
      }
      
      console.log(`Created screenings for movie: ${createdMovie.title}`);
    }
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 