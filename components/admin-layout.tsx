"use client"

import { type ReactNode, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { TicketIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/admin/auth-provider"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Sprawdź, czy jesteśmy na stronie logowania
  const isLoginPage = pathname === "/admin/login"

  // Jeśli nie jesteśmy zalogowani i nie jesteśmy na stronie logowania, przekieruj do logowania
  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoginPage, router])

  // Jeśli to strona logowania lub nie jesteśmy zalogowani, po prostu renderuj dzieci bez layoutu
  if (isLoginPage || !isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nagłówek */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2">
            <TicketIcon className="h-6 w-6" />
            <span className="font-bold">Admin Panel</span>
          </Link>
          <Button onClick={logout}>Wyloguj się</Button>
        </div>
      </header>

      {/* Zawartość */}
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
}
