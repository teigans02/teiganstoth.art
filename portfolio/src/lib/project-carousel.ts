import type { ProjectMetadata } from "@/types/project"

export interface CarouselSlide {
  id: string
  src: string
  alt: string
  color?: string
}

const featuredImages: { slug: string; image: "heroImageUrl" | "hero2ImageUrl" }[] = [
  { slug: "mighty", image: "heroImageUrl" },
  { slug: "hearst", image: "heroImageUrl" },
  { slug: "mighty", image: "hero2ImageUrl" },
  { slug: "nst", image: "heroImageUrl" },
  { slug: "teiga", image: "heroImageUrl" },
  { slug: "tfd", image: "hero2ImageUrl" },
]

export function getCarouselSlides(
  projects: ProjectMetadata[],
  imageColors: Record<string, string> = {},
): CarouselSlide[] {
  const slides: CarouselSlide[] = []
  const included = new Set<string>()
  const featuredProjects = new Set<string>()

  function add(project: ProjectMetadata, image: "heroImageUrl" | "hero2ImageUrl") {
    const src = project[image]
    const id = `${project.slug}-${image}`
    if (!src || included.has(id)) return
    included.add(id)
    slides.push({ id, src, color: imageColors[src], alt: `${project.title}${image === "hero2ImageUrl" ? " — secondary preview" : ""}` })
  }

  for (const entry of featuredImages) {
    const project = projects.find(project => project.slug === entry.slug)
    if (project && project[entry.image]) {
      add(project, entry.image)
      featuredProjects.add(project.slug)
    }
  }
  for (const project of [...projects].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))) {
    if (!featuredProjects.has(project.slug)) add(project, "heroImageUrl")
  }
  return slides
}
