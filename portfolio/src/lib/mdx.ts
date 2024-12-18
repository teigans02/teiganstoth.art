import { ProjectMetadata } from "@/types/project"
import fs from "fs"
import matter from "gray-matter"
import path from "path"

const projectsDirectory = path.join(process.cwd(), "src/projects")

export async function getAllProjects(): Promise<ProjectMetadata[]> {
  // Get all MDX files from the projects directory
  const files = fs.readdirSync(projectsDirectory)
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"))

  // Read and parse each MDX file
  const projects = mdxFiles.map((fileName) => {
    const filePath = path.join(projectsDirectory, fileName)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContents)
    
    // Extract the slug from the filename
    const slug = fileName.replace(/\.mdx$/, "")

    return {
      ...(data as Omit<ProjectMetadata, "slug">),
      slug,
    }
  })

  // Sort projects by date (most recent first)
  return projects.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
} 