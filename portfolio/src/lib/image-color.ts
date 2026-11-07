import path from "path"
import sharp from "sharp"

const colorCache = new Map<string, Promise<string | undefined>>()

export function getImageColor(src: string): Promise<string | undefined> {
  if (!src.startsWith("/") || src.endsWith(".svg")) return Promise.resolve(undefined)

  let color = colorCache.get(src)
  if (!color) {
    color = computeDominantColor(src)
    colorCache.set(src, color)
  }
  return color
}

export async function getImageColors(sources: (string | null | undefined)[]): Promise<Record<string, string>> {
  const uniqueSources = [...new Set(sources.filter((src): src is string => !!src))]
  const colors = await Promise.all(uniqueSources.map(getImageColor))
  return Object.fromEntries(
    uniqueSources.flatMap((src, index) => (colors[index] ? [[src, colors[index]]] : [])),
  )
}

async function computeDominantColor(src: string) {
  try {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""))
    const { dominant } = await sharp(filePath).flatten({ background: "#ffffff" }).stats()
    return `#${[dominant.r, dominant.g, dominant.b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
  } catch {
    return undefined
  }
}
