"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Check, Clock, CreditCard, Film, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Typy biletów i ich ceny
const TICKET_TYPES = {
  normal: { name: "Normalny", price: 25 },
  reduced: { name: "Ulgowy", price: 18 },
}

type SeatWithType = {
  row: number
  seat: number
  type: keyof typeof TICKET_TYPES
}

export default function ConfirmationPage({
  params,
}: {
  params: {
    movieId: string
    screeningId: string
    timeIndex: string
  }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedSeats, setSelectedSeats] = useState<SeatWithType[]>([])
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Pobieranie danych z localStorage
    try {
      const seatsData = localStorage.getItem("selectedSeats")
      const paymentStatus = localStorage.getItem("paymentStatus")

      if (seatsData) {
        const parsedSeats = JSON.parse(seatsData)
        setSelectedSeats(parsedSeats)
        setIsPaid(paymentStatus === "true")
      } else {
        // Jeśli nie ma danych, przekieruj do strony głównej
        toast({
          title: "Błąd",
          description: "Nie znaleziono danych o rezerwacji.",
          variant: "destructive",
        })
        router.push("/")
      }
    } catch (e) {
      console.error("Błąd parsowania danych:", e)
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas ładowania danych rezerwacji.",
        variant: "destructive",
      })
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  // W rzeczywistej aplikacji dane byłyby pobierane z bazy danych
  const movie = {
    id: Number.parseInt(params.movieId),
    title: params.movieId === "1" ? "Interstellar" : params.movieId === "2" ? "Incepcja" : "Joker",
    screening: {
      id: Number.parseInt(params.screeningId),
      date: params.screeningId === "1" ? "2025-04-07" : params.screeningId === "2" ? "2025-04-08" : "2025-04-09",
      time:
        params.screeningId === "1"
          ? ["10:00", "13:30", "17:00", "20:30"][Number.parseInt(params.timeIndex)]
          : params.screeningId === "2"
            ? ["11:00", "14:30", "18:00", "21:30"][Number.parseInt(params.timeIndex)]
            : ["10:30", "14:00", "17:30", "21:00"][Number.parseInt(params.timeIndex)],
    },
  }

  // Generowanie unikalnego kodu rezerwacji
  const reservationCode = `KP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + TICKET_TYPES[seat.type].price, 0)
  }

  const handleFinish = () => {
    // Czyszczenie danych z localStorage po zakończeniu procesu rezerwacji
    localStorage.removeItem("selectedSeats")
    localStorage.removeItem("paymentStatus")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Ładowanie potwierdzenia rezerwacji...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 max-w-2xl">
      <Card className="mb-8">
        <CardHeader className="text-center border-b">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Rezerwacja potwierdzona!</CardTitle>
          <CardDescription>
            Twój kod rezerwacji: <span className="font-bold">{reservationCode}</span>
            <div className="mt-2">
              <Badge
                variant={isPaid ? "success" : "outline"}
                className={isPaid ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              >
                {isPaid ? (
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" /> Opłacono
                  </span>
                ) : (
                  "Oczekuje na płatność"
                )}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Film className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Film</p>
                <p className="text-muted-foreground">{movie.title}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Data</p>
                <p className="text-muted-foreground">
                  {new Date(movie.screening.date).toLocaleDateString("pl-PL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Godzina</p>
                <p className="text-muted-foreground">{movie.screening.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Miejsca</p>
                <div className="text-muted-foreground">
                  {selectedSeats
                    .sort((a, b) => a.row - b.row || a.seat - b.seat)
                    .map((seat, index) => (
                      <div key={index}>
                        {String.fromCharCode(65 + seat.row)}
                        {seat.seat + 1} - {TICKET_TYPES[seat.type].name}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between">
                <p className="font-medium">Liczba biletów:</p>
                <p>{selectedSeats.length}</p>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <p>Łączna cena:</p>
                <p>{calculateTotalPrice()} zł</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            {isPaid
              ? "Dziękujemy za zakup biletów. Prosimy o przybycie 15 minut przed seansem i okazanie kodu rezerwacji w kasie Kina Fanth."
              : "Prosimy o dokonanie płatności w kasie Kina Fanth najpóźniej 30 minut przed seansem. W przeciwnym razie rezerwacja zostanie anulowana."}
          </p>
          <Button className="w-full" onClick={handleFinish}>
            Powrót do strony głównej
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
