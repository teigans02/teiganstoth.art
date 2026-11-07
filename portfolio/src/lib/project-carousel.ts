import type { ProjectMetadata } from "@/types/project"

export interface CarouselSlide {
  id: string
  src: string
  alt: string
}

// Featured images appear in this order; other published projects follow by date.
const featuredImages: { slug: string; image: "heroImageUrl" | "hero2ImageUrl" }[] = [
  { slug: "mighty", image: "heroImageUrl" },
  { slug: "hearst", image: "heroImageUrl" },
  { slug: "mighty", image: "hero2ImageUrl" },
  { slug: "nst", image: "heroImageUrl" },
  { slug: "teiga", image: "heroImageUrl" },
  { slug: "tfd", image: "hero2ImageUrl" },
]

export function getCarouselSlides(projects: ProjectMetadata[]): CarouselSlide[] {
  const published = projects.filter(project => project.published !== false)
  const slides: CarouselSlide[] = []
  const included = new Set<string>()
  const featuredProjects = new Set<string>()

  function add(project: ProjectMetadata, image: "heroImageUrl" | "hero2ImageUrl") {
    const src = project[image]
    const id = `${project.slug}-${image}`
    if (!src || included.has(id)) return
    included.add(id)
    slides.push({ id, src, alt: `${project.title}${image === "hero2ImageUrl" ? " — secondary preview" : ""}` })
  }

  for (const entry of featuredImages) {
    const project = published.find(project => project.slug === entry.slug)
    if (project && project[entry.image]) {
      add(project, entry.image)
      featuredProjects.add(project.slug)
    }
  }
  for (const project of [...published].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))) {
    if (!featuredProjects.has(project.slug)) add(project, "heroImageUrl")
  }
  return slides
}
