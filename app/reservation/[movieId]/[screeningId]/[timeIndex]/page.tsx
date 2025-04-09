"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, Info, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

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

export default function ReservationPage({
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

  // Generowanie sali kinowej (8 rzędów po 10 miejsc)
  const rows = 8
  const seatsPerRow = 10

  // Symulacja już zajętych miejsc (w rzeczywistej aplikacji byłyby pobierane z bazy danych)
  const takenSeats = [
    { row: 2, seat: 3 },
    { row: 2, seat: 4 },
    { row: 3, seat: 5 },
    { row: 3, seat: 6 },
    { row: 4, seat: 7 },
    { row: 4, seat: 8 },
    { row: 5, seat: 4 },
    { row: 5, seat: 5 },
    { row: 6, seat: 6 },
  ]

  // Symulacja tymczasowo zarezerwowanych miejsc (oczekujących na płatność)
  const temporaryReservedSeats = [
    { row: 1, seat: 5 },
    { row: 1, seat: 6 },
  ]

  const [selectedSeats, setSelectedSeats] = useState<SeatWithType[]>([])
  const [defaultTicketType, setDefaultTicketType] = useState<keyof typeof TICKET_TYPES>("normal")

  const isSeatTaken = (row: number, seat: number) => {
    return takenSeats.some((takenSeat) => takenSeat.row === row && takenSeat.seat === seat)
  }

  const isSeatTemporaryReserved = (row: number, seat: number) => {
    return temporaryReservedSeats.some((reservedSeat) => reservedSeat.row === row && reservedSeat.seat === seat)
  }

  const isSeatSelected = (row: number, seat: number) => {
    return selectedSeats.some((selectedSeat) => selectedSeat.row === row && selectedSeat.seat === seat)
  }

  const getSeatIndex = (row: number, seat: number) => {
    return selectedSeats.findIndex((selectedSeat) => selectedSeat.row === row && selectedSeat.seat === seat)
  }

  const toggleSeat = (row: number, seat: number) => {
    if (isSeatTaken(row, seat) || isSeatTemporaryReserved(row, seat)) return

    if (isSeatSelected(row, seat)) {
      setSelectedSeats(
        selectedSeats.filter((selectedSeat) => !(selectedSeat.row === row && selectedSeat.seat === seat)),
      )
    } else {
      // Sprawdzenie limitu 10 miejsc
      if (selectedSeats.length >= 10) {
        toast({
          title: "Limit miejsc",
          description: "Możesz wybrać maksymalnie 10 miejsc na jedną rezerwację.",
          variant: "destructive",
        })
        return
      }
      setSelectedSeats([...selectedSeats, { row, seat, type: defaultTicketType }])
    }
  }

  const updateSeatType = (row: number, seat: number, type: keyof typeof TICKET_TYPES) => {
    const seatIndex = getSeatIndex(row, seat)
    if (seatIndex !== -1) {
      const updatedSeats = [...selectedSeats]
      updatedSeats[seatIndex] = { ...updatedSeats[seatIndex], type }
      setSelectedSeats(updatedSeats)
    }
  }

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + TICKET_TYPES[seat.type].price, 0)
  }

  const handleReservation = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "Błąd",
        description: "Wybierz co najmniej jedno miejsce",
        variant: "destructive",
      })
      return
    }

    // Zapisanie wybranych miejsc w localStorage zamiast przekazywania przez URL
    try {
      localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats))

      // Przekierowanie do strony płatności bez przekazywania danych w URL
      router.push(`/payment/${params.movieId}/${params.screeningId}/${params.timeIndex}`)
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas przetwarzania rezerwacji. Spróbuj ponownie.",
        variant: "destructive",
      })
      console.error("Błąd zapisywania danych:", error)
    }
  }

  return (
    <main className="container mx-auto py-8">
      <Link href={`/movie/${params.movieId}`}>
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Powrót do filmu
        </Button>
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Wybór miejsc</CardTitle>
          <CardDescription>
            Film: {movie.title} | Data: {new Date(movie.screening.date).toLocaleDateString("pl-PL")} | Godzina:{" "}
            {movie.screening.time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="default-ticket-type">Domyślny typ biletu dla nowo wybranych miejsc:</Label>
            <Select
              value={defaultTicketType}
              onValueChange={(value) => setDefaultTicketType(value as keyof typeof TICKET_TYPES)}
            >
              <SelectTrigger id="default-ticket-type" className="w-full sm:w-[200px] mt-1">
                <SelectValue placeholder="Wybierz typ biletu" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TICKET_TYPES).map(([key, { name, price }]) => (
                  <SelectItem key={key} value={key}>
                    {name} ({price} zł)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-full max-w-3xl">
              <div className="bg-muted p-2 text-center mb-6 rounded-md">EKRAN</div>

              {/* Responsive container for the seat grid */}
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[320px] md:min-w-0">
                  <div className="grid gap-4">
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center gap-1 md:gap-2">
                        <div className="w-5 md:w-6 flex items-center justify-center font-bold text-xs md:text-sm">
                          {String.fromCharCode(65 + rowIndex)}
                        </div>
                        {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                          const taken = isSeatTaken(rowIndex, seatIndex)
                          const temporaryReserved = isSeatTemporaryReserved(rowIndex, seatIndex)
                          const selected = isSeatSelected(rowIndex, seatIndex)

                          let bgColor = "bg-secondary hover:bg-secondary/80"
                          let statusText = "dostępne"

                          if (taken) {
                            bgColor = "bg-rose-500 text-white cursor-not-allowed"
                            statusText = "zajęte"
                          } else if (temporaryReserved) {
                            bgColor = "bg-amber-200 text-amber-800 cursor-not-allowed"
                            statusText = "oczekuje na płatność"
                          } else if (selected) {
                            bgColor = "bg-primary text-primary-foreground"
                            statusText = "wybrane"
                          }

                          return (
                            <button
                              key={seatIndex}
                              className={`w-7 h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center text-xs transition-colors ${bgColor}`}
                              onClick={() => toggleSeat(rowIndex, seatIndex)}
                              disabled={taken || temporaryReserved}
                              aria-label={`Rząd ${String.fromCharCode(65 + rowIndex)}, miejsce ${seatIndex + 1}, ${statusText}`}
                            >
                              {selected ? <Check className="h-3 w-3 md:h-4 md:w-4" /> : seatIndex + 1}
                            </button>
                          )
                        })}
                        <div className="w-5 md:w-6 flex items-center justify-center font-bold text-xs md:text-sm">
                          {String.fromCharCode(65 + rowIndex)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-secondary"></div>
              <span className="text-xs md:text-sm">Dostępne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-primary"></div>
              <span className="text-xs md:text-sm">Wybrane</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-amber-200"></div>
              <span className="text-xs md:text-sm">Oczekuje na płatność</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-rose-500"></div>
              <span className="text-xs md:text-sm">Zajęte</span>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="mt-8 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Wybrane miejsca: ({selectedSeats.length}/10)</h3>
                {selectedSeats.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedSeats([])} className="text-xs">
                    Wyczyść wszystkie
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedSeats
                  .sort((a, b) => a.row - b.row || a.seat - b.seat)
                  .map((seat, index) => (
                    <div key={index} className="flex items-center p-2 border rounded-md bg-muted/30">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                        {String.fromCharCode(65 + seat.row)}
                        {seat.seat + 1}
                      </div>
                      <Select
                        value={seat.type}
                        onValueChange={(value) =>
                          updateSeatType(seat.row, seat.seat, value as keyof typeof TICKET_TYPES)
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TICKET_TYPES).map(([key, { name, price }]) => (
                            <SelectItem key={key} value={key}>
                              {name} ({price} zł)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => toggleSeat(seat.row, seat.seat)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Usuń miejsce</span>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="font-medium">Liczba biletów:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Łączna cena:</span>
              <span className="font-bold">{calculateTotalPrice()} zł</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Normalny: {TICKET_TYPES.normal.price} zł</p>
                    <p>Ulgowy: {TICKET_TYPES.reduced.price} zł</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button onClick={handleReservation} className="w-full sm:w-auto">
            Przejdź do płatności
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
