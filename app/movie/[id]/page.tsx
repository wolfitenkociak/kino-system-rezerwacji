import Link from "next/link"
import { CalendarDays, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MoviePage({ params }: { params: { id: string } }) {
  // Dane filmów
  const movies = [
    {
      id: 1,
      title: "Wiedźadmin",
      description: "Fakturka na mailu. Tylko na FLETIX.",
      image: "/images/wiedzadmin.png",
      duration: "120 min",
      dates: ["2025-04-07", "2025-04-08", "2025-04-09"],
    },
    {
      id: 2,
      title: "Anetka z HR",
      description: "Czyste stopy przepustką do serca... no i może ewentualnie nowej pracy",
      image: "/images/anetka.png",
      duration: "105 min",
      dates: ["2025-04-07", "2025-04-08", "2025-04-09"],
    },
    {
      id: 3,
      title: "Nic Informatycznego",
      description: "No wiesz... obiecanki-ruchanki, falbanki-firanki.",
      image: "/images/nic-informatycznego.png",
      duration: "135 min",
      dates: ["2025-04-07", "2025-04-08", "2025-04-09"],
    },
  ]

  // Znajdź film na podstawie ID
  const movieId = Number.parseInt(params.id)
  const movie = movies.find((m) => m.id === movieId) || movies[0]

  // Dane seansów
  const screenings = [
    {
      id: 1,
      date: "2025-04-07",
      times: ["10:00", "13:30", "17:00", "20:30"],
    },
    {
      id: 2,
      date: "2025-04-08",
      times: ["11:00", "14:30", "18:00", "21:30"],
    },
    {
      id: 3,
      date: "2025-04-09",
      times: ["10:30", "14:00", "17:30", "21:00"],
    },
  ]

  return (
    <main className="container mx-auto py-8">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          Powrót do repertuaru
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="aspect-[3/4] relative">
          <img
            src={movie.image || "/placeholder.svg"}
            alt={movie.title}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg mb-6">{movie.description}</p>

          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <Clock className="h-5 w-5" />
            <span>{movie.duration}</span>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Dostępne seanse</h2>

          {screenings.map((screening) => (
            <Card key={screening.id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {new Date(screening.date).toLocaleDateString("pl-PL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {screening.times.map((time, index) => (
                    <Link key={index} href={`/reservation/${movie.id}/${screening.id}/${index}`}>
                      <Button variant="outline" className="w-full">
                        {time}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
