import { NextResponse } from "next/server";
import prismadb from "@/lib/db";

export async function GET() {
  try {
    const movies = await prismadb.movie.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.log('[MOVIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();
    const { title, description, duration, imageUrl, releaseDate } = body;

    if (!title || !description || !duration || !releaseDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const movie = await prismadb.movie.create({
      data: {
        title,
        description,
        duration,
        imageUrl,
        releaseDate: new Date(releaseDate),
      }
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.log('[MOVIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 