import fs from "fs"
import path from "path"

const fallback = { width: 1200, height: 800 }

function readJpegSize(buffer: Buffer) {
  let offset = 2
  while (offset < buffer.length - 8) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = buffer[offset + 1]
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x00 || marker === 0xff) {
      offset += 2
      continue
    }

    const length = buffer.readUInt16BE(offset + 2)
    const isSof =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)

    if (isSof) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      }
    }

    offset += 2 + length
  }

  return null
}

export function getLocalImageSize(src: string) {
  try {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""))
    const buffer = fs.readFileSync(filePath)

    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      }
    }

    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      return readJpegSize(buffer) ?? fallback
    }
  } catch {
    return fallback
  }

  return fallback
}
