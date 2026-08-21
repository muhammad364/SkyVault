interface SceneFallbackProps {
  label: string
  imageSrc?: string
  darkImageSrc?: string
}

export function SceneFallback({
  label,
  imageSrc = '/brand/skyvault-mark.svg',
  darkImageSrc = '/brand/skyvault-mark-dark-v3.svg',
}: SceneFallbackProps) {
  return (
    <div
      className="flex aspect-square w-full items-center justify-center rounded-lg bg-card-muted p-8"
      role="img"
      aria-label={label}
    >
      <img src={imageSrc} alt="" className="h-full w-full object-contain dark:hidden" />
      <img
        src={darkImageSrc}
        alt=""
        aria-hidden="true"
        className="hidden h-full w-full object-contain dark:block"
      />
    </div>
  )
}
