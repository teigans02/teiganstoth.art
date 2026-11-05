import type { MetadataRoute } from "next"
import { getAllProjects } from "@/lib/mdx"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://teiganstoth.art"
  const projects = await getAllProjects()
  return [
    {
      url: base,
      images: [
        `${base}/images/mighty/hero.jpg`,
        `${base}/images/teiga/hero.jpg`,
      ],
    },
    { url: `${base}/about`, images: [`${base}/images/teigan-stothart.jpeg`] },
    ...projects.filter(project => project.published !== false).map(project => ({
      url: `${base}/projects/${project.slug}`,
    })),
  ]
}
