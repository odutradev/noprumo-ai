import { useMemo } from "react"

import { buildArtwork } from "@utils/functions/brand"
import BrandArtwork from "@components/brandArtwork"
import { themedColors } from "@assets/data/brand"
import styles from "./styles.module.css"

import type { BrandLogoProps } from "./types"

const BrandLogo = ({ kind = "horizontal", optical = "medium", label, className }: BrandLogoProps) => {
  const artwork = useMemo(() => buildArtwork({ kind, palette: "light", tile: "ink", background: "transparent", ratio: "original", optical }, themedColors), [kind, optical])

  return <BrandArtwork artwork={artwork} label={label} className={[styles.logo, className].filter(Boolean).join(" ")} />
}

export default BrandLogo
