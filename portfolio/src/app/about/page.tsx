import type { Metadata } from "next"
import Image from "next/image"
import { getLocalImageSize } from "@/lib/local-image-size"

const description = "Teigan Stothart is a London-based marketing strategist. Her experience spans DTC marketing, paid media, and consumer research."

export const metadata: Metadata = {
  title: "About Teigan Stothart",
  description,
  alternates: { canonical: "https://teiganstoth.art/about" },
}

export default function AboutPage() {
  const { width, height } = getLocalImageSize("/images/teigan-stothart.jpeg")

  return (
    <main className="mx-auto max-w-xl px-6 py-12 md:py-20">
      <h1 className="mb-6 font-instrument text-4xl">Teigan Stothart</h1>
      <Image
        src="/images/teigan-stothart.jpeg"
        alt="Teigan Stothart"
        width={width}
        height={height}
        sizes="(max-width: 576px) calc(100vw - 3rem), 528px"
        className="h-auto w-full rounded-lg"
        priority
        unoptimized
      />
      <p className="mt-6 text-lg leading-relaxed text-gray-700">{description}</p>
    </main>
  )
}
