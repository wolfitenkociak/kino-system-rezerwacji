import { NextResponse } from "next/server";
import prismadb from "@/lib/db";

export async function GET() {
  try {
    // Usuń wszystkie seanse
    await prismadb.screening.deleteMany();
    
    // Usuń wszystkie filmy
    await prismadb.movie.deleteMany();
    
    // Dodaj filmy
    const movies = [
      {
        title: "Nic Informatycznego",
        description: "No wiesz... obiecanki-ruchanki, falbanki-firanki. By trzeba było pracować, no... pchać tematy do przodu...",
        duration: 135,
        imageUrl: "/posters/nic-informatycznego.jpg",
        releaseDate: new Date('2025-04-07')
      },
      {
        title: "Wiedźadmin",
        description: "Fakturka na mailu. Tylko na FLETIX.",
        duration: 120,
        imageUrl: "/posters/wiedzadmin.jpg",
        releaseDate: new Date('2025-04-08')
      },
      {
        title: "Anetka z HR",
        description: "Czyste stopy przepustką do serca... no i może ewentualnie nowej pracy.",
        duration: 105,
        imageUrl: "/posters/anetka-z-hr.jpg",
        releaseDate: new Date('2025-04-09')
      }
    ];
    
    // Dodaj filmy do bazy danych
    const createdMovies = [];
    
    for (const movie of movies) {
      const createdMovie = await prismadb.movie.create({
        data: movie
      });
      
      createdMovies.push(createdMovie);
      
      // Dla każdego filmu dodaj seanse
      const dates = [
        new Date('2025-04-10T18:00:00Z'),
        new Date('2025-04-10T21:00:00Z'),
        new Date('2025-04-11T18:00:00Z'),
        new Date('2025-04-11T21:00:00Z')
      ];
      
      for (const date of dates) {
        await prismadb.screening.create({
          data: {
            movieId: createdMovie.id,
            date,
            hall: `Sala ${Math.floor(Math.random() * 5) + 1}`
          }
        });
      }
    }
    
    return NextResponse.json({
      message: "Movies and screenings created successfully", 
      movies: createdMovies
    });
    
  } catch (error) {
    console.error("[SEED]", error);
    return NextResponse.json({ error: "Error seeding database" }, { status: 500 });
  }
} 