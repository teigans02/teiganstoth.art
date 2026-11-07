import { BackButton } from "@/components/back-button"
import { HearstLogoGrid } from "@/components/hearst-logo-grid"
import Header from "@/components/header"
import { RevealImage } from "@/components/reveal-image"
import { getImageColor } from "@/lib/image-color"
import { getLocalImageSize } from "@/lib/local-image-size"
import { getAllProjects } from "@/lib/mdx"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Metadata } from "next"

export const dynamic = 'force-static'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const filePath = path.join(process.cwd(), "src/projects", `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.'
    }
  }

  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data } = matter(fileContent)
  const title = `${data.title} | Teigan Stothart`
  const url = `https://teiganstoth.art/projects/${encodeURIComponent(slug)}`
  const images = data.heroImageUrl ? [{
    url: data.heroImageUrl,
    ...getLocalImageSize(data.heroImageUrl),
    alt: data.title,
  }] : []
  
  return {
    title,
    description: data.description,
    alternates: { canonical: url },
    openGraph: {
      siteName: "Teigan Stothart",
      type: "website",
      title,
      description: data.description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.description,
      images,
    },
  }
}

const ImageGrid = async ({ images }: { images: string }) => {
  const sources = images.split(" ")
  const colors = await Promise.all(sources.map(getImageColor))
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 -gap-y-4">
      {sources.map((image, index) => {
        const { width, height } = getLocalImageSize(image)
        return (
          <RevealImage
            key={index}
            src={image}
            alt={`Gallery Image ${index + 1}`}
            width={width}
            height={height}
            sizes="(max-width: 640px) calc(50vw - 2.5rem), (max-width: 768px) calc(33vw - 2rem), 240px"
            placeholderColor={colors[index]}
            wrapperClassName="my-[2em] overflow-hidden rounded-lg"
            className="!my-0 h-auto w-full"
          />
        )
      })}
    </div>
  )
}

const MdxImage = async ({ src, alt }: { src?: string; alt?: string }) => {
  if (!src) return null
  const { width, height } = getLocalImageSize(src)
  return (
    <RevealImage
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      sizes="(max-width: 48rem) calc(100vw - 4rem), 48rem"
      placeholderColor={await getImageColor(src)}
      wrapperClassName="my-[2em] overflow-hidden rounded-lg"
      className="!my-0 h-auto w-full"
    />
  )
}

const FigmaEmbed = ({ url }: { url: string }) => {
  return (
    <div className="w-full flex justify-center mb-8">
      <iframe 
        style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
        width="800"
        height="450"
        src={url}
        allowFullScreen
      />
    </div>
  )
}

type Params = Promise<{ slug: string }>;

interface Props {
  params: Params
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  
  const filePath = path.join(process.cwd(), "src/projects", `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const fileContent = fs.readFileSync(filePath, "utf8")
  const { content } = matter(fileContent)

  return (
    <div className="min-h-[100svh] bg-white pb-[env(safe-area-inset-bottom,0px)]">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="p-8 pt-[max(2rem,env(safe-area-inset-top,0px))] md:pt-8">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <article className="mt-8 prose prose-md prose-headings:font-styrene prose-img:rounded-lg max-w-none">
            <MDXRemote 
              source={content}
              components={{
                ImageGrid,
                FigmaEmbed,
                HearstLogoGrid,
                img: MdxImage,
              }}
            />
          </article>
        </div>
      </div>
    </div>
  )
}
