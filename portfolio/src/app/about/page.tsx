import type { Metadata } from "next"
import Image from "next/image"
import { getLocalImageSize } from "@/lib/local-image-size"
import { socialPreviewImage } from "@/lib/site-metadata"

const name = "Teigan Stothart"
const url = "https://teiganstoth.art/about"
const imagePath = "/images/teigan-stothart.jpeg"
const description = "Teigan Stothart is a London-based marketing strategist. Her experience spans DTC marketing, paid media, and consumer research."

export const metadata: Metadata = {
  title: "About Teigan Stothart",
  description,
  alternates: { canonical: url },
  openGraph: {
    siteName: name,
    type: "profile",
    url,
    title: "About Teigan Stothart",
    description,
    images: [socialPreviewImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [socialPreviewImage],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url,
  mainEntity: {
    "@type": "Person",
    name,
    jobTitle: "Marketing strategist",
    description,
    image: `https://teiganstoth.art${imagePath}`,
    url,
    homeLocation: { "@type": "Place", name: "London" },
  },
}

export default function AboutPage() {
  const { width, height } = getLocalImageSize(imagePath)

  return (
    <main className="mx-auto max-w-xl px-6 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <h1 className="mb-6 font-instrument text-4xl">{name}</h1>
      <Image
        src={imagePath}
        alt={name}
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
