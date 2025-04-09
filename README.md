# Cinema Reservation System

A modern cinema ticket reservation system built with Next.js, Prisma, and MySQL.

## Features

- User-friendly movie browsing and ticket reservation
- Admin panel for managing movies and screenings
- Secure authentication system
- Responsive design for all devices
- Toast notifications for user feedback

## Prerequisites

- Node.js 18+ 
- MySQL database
- pnpm package manager

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/kino-system-rezerwacji.git
cd kino-system-rezerwacji
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Copy the example environment file and adjust it to your needs:

```bash
cp .env.example .env
```

Edit the `.env` file with your MySQL database credentials.

4. Set up the database

```bash
pnpm prisma:generate     # Generate Prisma client
pnpm prisma:migrate      # Apply migrations
pnpm seed                # Seed the database with sample data
```

Or run all database setup commands at once:

```bash
pnpm setup
```

5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Production Deployment

### Using Docker

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t cinema-reservation-system .

# Run the container
docker run -p 3000:3000 -e DATABASE_URL=mysql://user:password@host:port/database cinema-reservation-system
```

### Manual Deployment

1. Build the application

```bash
pnpm build
```

2. Start the production server

```bash
pnpm start
```

## Project Structure

- `app/` - Next.js application routes and pages
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and database client
- `prisma/` - Database schema and migrations
- `public/` - Static assets
- `scripts/` - Database seeding scripts

## Admin Access

Default admin credentials:
- Email: admin@example.com
- Password: admin123

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
