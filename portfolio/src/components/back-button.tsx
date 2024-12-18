"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-6 left-6 p-2 text-black
        hover:scale-110 transition-transform duration-200"
    >
      <ChevronLeft size={24} />
    </button>
  )
} 