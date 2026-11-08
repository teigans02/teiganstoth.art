import type { MetadataRoute } from "next"
import { getAllProjects } from "@/lib/mdx"
import { siteUrl } from "@/lib/site-metadata"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl
  const projects = await getAllProjects()
  return [
    {
      url: base,
      images: [
        `${base}/images/mighty/hero.jpg`,
        `${base}/images/teiga/hero.jpg`,
      ],
    },
    { url: `${base}/about`, images: [`${base}/images/teigan-stothart.jpg`] },
    ...projects.map(project => ({
      url: `${base}/projects/${project.slug}`,
    })),
  ]
}
