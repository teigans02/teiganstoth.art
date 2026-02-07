import { BackButton } from "@/components/back-button"
import Header from "@/components/header"
import { getAllProjects } from "@/lib/mdx"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Image from "next/image"
import { twMerge } from "tailwind-merge"

export const dynamic = 'force-static'

export async function generateMetadata({ params }: Props) {
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
  
  return {
    title: data.title,
    description: data.description,
  }
}

const ImageGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 -gap-y-4">
      {images.map((image, index) => (
        <Image key={index} src={image} alt={`Gallery Image ${index + 1}`} width={1000} height={1000} />
      ))}
    </div>
  )
}

const SingleImage = ({ src, alt }: { src: string; alt?: string }) => {
  return (
    <div className={twMerge("w-full my-4", "px-4 md:px-8 lg:px-16")}>
      <Image src={src} alt={alt || "Project image"} width={1000} height={1000} className="rounded-lg" />
    </div>
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
    <div className="min-h-screen bg-white">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <article className="mt-8 prose prose-md prose-headings:font-styrene prose-img:rounded-lg max-w-none">
            <MDXRemote 
              source={content}
              components={{
                ImageGrid,
                SingleImage,
                FigmaEmbed,
              }}
            />
          </article>
        </div>
      </div>
    </div>
  )
} 