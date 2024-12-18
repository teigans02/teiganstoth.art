"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 p-2 text-black"
    >
      <ChevronLeft size={24} />
      <span className="text-lg">Back</span>
    </button>
  )
} 