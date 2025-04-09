import { NextResponse } from "next/server";
import prismadb from "@/lib/db";

export async function GET(
  req: Request
) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movieId');

    const query = movieId ? { movieId } : {};

    const screenings = await prismadb.screening.findMany({
      where: query,
      include: {
        movie: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(screenings);
  } catch (error) {
    console.log('[SCREENINGS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();
    const { movieId, date, hall } = body;

    if (!movieId || !date || !hall) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if the movie exists
    const movie = await prismadb.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      return new NextResponse("Movie not found", { status: 404 });
    }

    const screening = await prismadb.screening.create({
      data: {
        movieId,
        date: new Date(date),
        hall
      }
    });

    return NextResponse.json(screening);
  } catch (error) {
    console.log('[SCREENINGS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 