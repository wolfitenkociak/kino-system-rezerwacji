"use client"

import type React from "react"

import { AuthProvider } from "@/components/admin/auth-provider"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  )
}
