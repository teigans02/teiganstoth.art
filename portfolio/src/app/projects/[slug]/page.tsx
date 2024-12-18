import { BackButton } from "@/components/back-button"
import Header from "@/components/header"
import { getAllProjects } from "@/lib/mdx"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

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
    <div className="min-h-screen bg-[#F8F8EF]">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <article className="mt-8 prose prose-lg prose-headings:font-styrene">
            <MDXRemote source={content} />
          </article>
        </div>
      </div>
    </div>
  )
} 