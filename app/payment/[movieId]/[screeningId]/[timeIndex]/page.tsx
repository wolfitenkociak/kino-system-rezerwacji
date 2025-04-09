"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Check, Clock, Film, Timer, X, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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

export default function PaymentPage({
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
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(180) // 3 minuty w sekundach
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Pobieranie danych z localStorage zamiast z URL
    try {
      const seatsData = localStorage.getItem("selectedSeats")
      if (seatsData) {
        const parsedSeats = JSON.parse(seatsData)
        setSelectedSeats(parsedSeats)
      } else {
        // Jeśli nie ma danych, przekieruj do strony wyboru filmu
        toast({
          title: "Błąd",
          description: "Nie znaleziono danych o wybranych miejscach.",
          variant: "destructive",
        })
        router.push(`/movie/${params.movieId}`)
      }
    } catch (e) {
      console.error("Błąd parsowania miejsc:", e)
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas ładowania danych.",
        variant: "destructive",
      })
      router.push(`/movie/${params.movieId}`)
    } finally {
      setIsLoading(false)
    }
  }, [params.movieId, router, toast])

  // Timer odliczający czas na płatność
  useEffect(() => {
    if (timeLeft <= 0) {
      // Czas minął, anuluj rezerwację
      toast({
        title: "Czas na płatność minął",
        description: "Twoja rezerwacja została anulowana.",
        variant: "destructive",
      })
      localStorage.removeItem("selectedSeats") // Usunięcie danych z localStorage
      router.push(`/movie/${params.movieId}`)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, router, params.movieId, toast])

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

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + TICKET_TYPES[seat.type].price, 0)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handlePayment = (success: boolean) => {
    setIsProcessing(true)

    // Symulacja przetwarzania płatności
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(success)

      if (success) {
        // W rzeczywistej aplikacji tutaj byłoby zapisanie potwierdzonej rezerwacji do bazy danych
        setTimeout(() => {
          // Przekazanie danych do strony potwierdzenia przez localStorage
          localStorage.setItem("paymentStatus", "true")
          router.push(`/confirmation/${params.movieId}/${params.screeningId}/${params.timeIndex}`)
        }, 1500)
      } else {
        toast({
          title: "Płatność odrzucona",
          description: "Spróbuj ponownie lub wybierz inną metodę płatności.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  const cancelReservation = () => {
    // W rzeczywistej aplikacji tutaj byłoby usunięcie tymczasowej rezerwacji z bazy danych
    localStorage.removeItem("selectedSeats") // Usunięcie danych z localStorage
    router.push(`/movie/${params.movieId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Ładowanie danych płatności...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 max-w-2xl">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Płatność za bilety</CardTitle>
            <div className="flex items-center gap-2 text-amber-600">
              <Timer className="h-5 w-5" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <CardDescription>
            Masz 3 minuty na dokończenie płatności. Po tym czasie rezerwacja zostanie anulowana.
          </CardDescription>
          <Progress value={(timeLeft / 180) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
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
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Wybrane miejsca:</h3>
            <div className="space-y-2">
              {selectedSeats.map((seat, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {String.fromCharCode(65 + seat.row)}
                    {seat.seat + 1} ({TICKET_TYPES[seat.type].name})
                  </span>
                  <span>{TICKET_TYPES[seat.type].price} zł</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
              <span>Łączna cena:</span>
              <span>{calculateTotalPrice()} zł</span>
            </div>
          </div>

          {paymentSuccess === null && (
            <div className="border-t pt-6">
              <h3 className="text-base font-medium mb-4 text-center">Wybierz metodę płatności</h3>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-md border transition-colors ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard
                      className={`h-6 w-6 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">Karta</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("blik")}
                  className={`p-4 rounded-md border transition-colors ${
                    paymentMethod === "blik"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`font-bold text-sm ${paymentMethod === "blik" ? "text-primary" : "text-muted-foreground"}`}
                    >
                      BLIK
                    </div>
                    <span className="text-sm">Blik</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-4 rounded-md border transition-colors ${
                    paymentMethod === "transfer"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className={`h-6 w-6 ${paymentMethod === "transfer" ? "text-primary" : "text-muted-foreground"}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8V6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6V8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10V16M12 10V16M17 10V16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 19H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm">Przelew</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {paymentSuccess !== null && (
            <div className="flex flex-col items-center py-4">
              {paymentSuccess ? (
                <>
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-600">Płatność zaakceptowana</h3>
                  <p className="text-muted-foreground mt-1">Przekierowujemy Cię do potwierdzenia rezerwacji...</p>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-medium text-red-600">Płatność odrzucona</h3>
                  <p className="text-muted-foreground mt-1">Spróbuj ponownie lub wybierz inną metodę płatności.</p>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {paymentSuccess === null && (
            <>
              <Button variant="outline" className="w-full sm:w-auto" onClick={cancelReservation}>
                Anuluj rezerwację
              </Button>
              <div className="flex-1 flex gap-3">
                <Button className="w-full sm:w-auto flex-1" onClick={() => handlePayment(true)} disabled={isProcessing}>
                  {isProcessing ? "Przetwarzanie..." : "Zapłać"}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => handlePayment(false)}
                  disabled={isProcessing}
                >
                  Symuluj błąd płatności
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
