import { MDXContent } from "mdx/types"

export interface ProjectMetadata {
  title: string
  description: string
  date: string
  tags: string[]
  published: boolean
  slug: string
}

export interface Project extends ProjectMetadata {
  body: MDXContent
}