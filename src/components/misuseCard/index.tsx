import { CloseIcon } from "enchase/icons"
import { useMemo } from "react"

import { brandColors, brandPalettes } from "@assets/data/brand"
import { buildArtwork } from "@utils/functions/brand"
import BrandArtwork from "@components/brandArtwork"
import BrandStage from "@components/brandStage"
import styles from "./styles.module.css"

import type { ArtworkSpec } from "@utils/types/brand"
import type { MisuseCardProps } from "./types"

const wrongColors = { ...brandPalettes[0].colors, ink: brandColors.orangeMark, muted: brandColors.orangeMark, mark: brandColors.chalkBlue }

const MisuseCard = ({ example }: MisuseCardProps) => {
  const artwork = useMemo(() => {
    const spec: ArtworkSpec = { kind: "horizontal", palette: example.kind === "busy" ? "dark" : "light", tile: "ink", background: "transparent", ratio: "original" }
    return buildArtwork(spec, example.kind === "recolor" ? wrongColors : undefined)
  }, [example.kind])

  return (
    <figure className={styles.card}>
      <BrandStage tone="light" className={styles.stage}>
        {example.kind === "rename" ? (
          <span className={styles.rename} style={{ color: brandColors.graphite }}>
            No Prumo
          </span>
        ) : (
          <span className={styles.frame} data-misuse={example.kind}>
            <BrandArtwork artwork={artwork} />
          </span>
        )}
        <span className={styles.cross} aria-hidden="true">
          <CloseIcon size={14} />
        </span>
      </BrandStage>
      <figcaption className={styles.caption}>{example.title}</figcaption>
    </figure>
  )
}

export default MisuseCard
