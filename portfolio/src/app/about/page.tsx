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
    <main className="mx-auto flex h-[100svh] max-w-xl flex-col justify-center px-6 pt-[max(1.5rem,env(safe-area-inset-top,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <h1 className="mb-6 shrink-0 font-instrument text-4xl">{name}</h1>
      <Image
        src={imagePath}
        alt={name}
        width={width}
        height={height}
        sizes="(max-width: 576px) calc(100vw - 3rem), 528px"
        className="min-h-0 w-auto max-w-full self-start rounded-lg object-contain"
        priority
        unoptimized
      />
      <p className="mt-6 shrink-0 text-lg leading-relaxed text-gray-700">{description}</p>
    </main>
  )
}
