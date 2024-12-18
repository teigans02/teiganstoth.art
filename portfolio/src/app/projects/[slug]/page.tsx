import { BackButton } from "@/components/back-button"
import { getAllProjects } from "@/lib/mdx"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = params
  const filePath = path.join(process.cwd(), "src/projects", `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const fileContent = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(fileContent)

  return (
    <div className="min-h-screen bg-[#F8F8EF] p-8">
      <BackButton />
      <article className="max-w-3xl mx-auto mt-16 prose prose-lg">
        <MDXRemote source={content} />
      </article>
    </div>
  )
} 