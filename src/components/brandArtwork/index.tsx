import styles from "./styles.module.css"

import type { BrandArtworkProps } from "./types"

const BrandArtwork = ({ artwork, label, className }: BrandArtworkProps) => (
  <svg
    viewBox={`0 0 ${artwork.width} ${artwork.height}`}
    className={[styles.artwork, className].filter(Boolean).join(" ")}
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    focusable="false"
  >
    {artwork.background && <rect width={artwork.width} height={artwork.height} style={{ fill: artwork.background }} />}
    {artwork.groups.map((group, groupIndex) => (
      <g key={groupIndex} transform={group.transform}>
        {group.shapes.map((shape, shapeIndex) =>
          shape.stroke ? (
            <path key={shapeIndex} d={shape.d} strokeWidth={shape.strokeWidth} strokeLinecap="round" style={{ fill: "none", stroke: shape.stroke }} />
          ) : (
            <path key={shapeIndex} d={shape.d} style={{ fill: shape.fill }} />
          )
        )}
      </g>
    ))}
  </svg>
)

export default BrandArtwork
