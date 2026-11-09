import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getLocalImageSize } from "@/lib/local-image-size"
import { siteUrl } from "@/lib/site-metadata"

const name = "Teigan Stothart"
const url = `${siteUrl}/about`
const imagePath = "/images/teigan-stothart.jpg"
const profileImage = {
  url: imagePath,
  ...getLocalImageSize(imagePath),
  alt: name,
}
const description = "Teigan Stothart is a London-based marketing strategist. Her experience spans DTC marketing, paid media, and consumer research."

export const metadata: Metadata = {
  title: "About | Teigan Stothart",
  description,
  alternates: { canonical: url },
  openGraph: {
    siteName: name,
    type: "profile",
    url,
    title: "About | Teigan Stothart",
    description,
    images: [profileImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [profileImage],
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
    image: `${siteUrl}${imagePath}`,
    url,
    sameAs: [
      "https://www.instagram.com/teigastudios/",
      "https://www.linkedin.com/in/teigan-stothart-40a8b323a/",
    ],
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
      <Link href="/" className="mt-4 shrink-0 self-start text-lg leading-relaxed text-gray-700 underline underline-offset-4">
        View work
      </Link>
    </main>
  )
}
