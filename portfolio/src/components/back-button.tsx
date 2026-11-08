"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="project-link -ml-4 flex items-center gap-1 rounded-md p-2 text-black active:scale-[0.97]"
    >
      <ChevronLeft size={20} />
      <span className="text-lg">Back</span>
    </button>
  )
} 