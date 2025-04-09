"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type AuthContextType = {
  isAuthenticated: boolean
  username: string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: null,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Sprawdzenie czy użytkownik jest zalogowany przy ładowaniu strony
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    const adminUsername = localStorage.getItem("adminUsername")

    setIsAuthenticated(adminLoggedIn)
    setUsername(adminUsername)
    setIsLoading(false)

    // Przekierowanie do strony logowania, jeśli użytkownik nie jest zalogowany
    // i próbuje uzyskać dostęp do panelu administracyjnego
    if (!adminLoggedIn && pathname?.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const logout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUsername")
    setIsAuthenticated(false)
    setUsername(null)
    router.push("/admin/login")
  }

  // Nie renderuj dzieci dopóki nie sprawdzimy stanu autentykacji
  if (isLoading && pathname !== "/admin/login") {
    return null
  }

  return <AuthContext.Provider value={{ isAuthenticated, username, logout }}>{children}</AuthContext.Provider>
}
