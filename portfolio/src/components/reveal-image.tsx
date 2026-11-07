"use client"

import Image, { type ImageProps } from "next/image"
import { useLayoutEffect, useRef, useState } from "react"

interface RevealImageProps extends ImageProps {
  placeholderColor?: string
  wrapperClassName?: string
}

export function RevealImage({
  placeholderColor,
  wrapperClassName = "",
  className = "",
  alt,
  onLoad,
  onError,
  ...imageProps
}: RevealImageProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [reveal, setReveal] = useState<"hidden" | "instant" | "fade">("hidden")

  useLayoutEffect(() => {
    if (imageRef.current?.complete) setReveal("instant")
  }, [])

  const handleImageSettled = () => setReveal((current) => (current === "hidden" ? "fade" : current))

  return (
    <span
      className={`block ${wrapperClassName}`}
      style={{ backgroundColor: placeholderColor ?? "#f3f4f6" }}
    >
      <Image
        ref={imageRef}
        alt={alt}
        {...imageProps}
        onLoad={(event) => {
          handleImageSettled()
          onLoad?.(event)
        }}
        onError={(event) => {
          handleImageSettled()
          onError?.(event)
        }}
        className={`${className} ${
          reveal === "hidden" ? "opacity-0" : reveal === "fade" ? "transition-opacity duration-200 ease-out" : ""
        }`}
      />
    </span>
  )
}
