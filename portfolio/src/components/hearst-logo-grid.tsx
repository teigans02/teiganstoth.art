interface HearstLogoGridProps {
  color?: string
  className?: string
}

export function HearstLogoGrid({ color = "currentColor", className = "" }: HearstLogoGridProps) {
  return (
    <div
      role="img"
      aria-label="Hearst magazine brands"
      className={`my-10 w-full ${className}`}
      style={{
        color,
        aspectRatio: "1838 / 444",
        backgroundColor: "currentColor",
        maskImage: "url(/images/hearst/hearst-logo-grid.svg)",
        maskSize: "contain",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskImage: "url(/images/hearst/hearst-logo-grid.svg)",
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  )
}
