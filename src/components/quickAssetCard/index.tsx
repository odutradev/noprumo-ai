import { useMemo } from "react"

import { buildArtwork, downloadArtwork } from "@utils/functions/brand"
import BrandArtwork from "@components/brandArtwork"
import ActionButton from "@components/actionButton"
import BrandStage from "@components/brandStage"
import useAnalytics from "@hooks/useAnalytics"
import styles from "./styles.module.css"

import type { BrandStageTone } from "@components/brandStage/types"
import type { ExportFormat, PaletteId } from "@utils/types/brand"
import type { QuickAssetCardProps } from "./types"

const stageTones: Record<PaletteId, BrandStageTone> = { light: "light", dark: "dark", onOrange: "orange", monoInk: "light", monoWhite: "dark", monoOrange: "light" }

const QuickAssetCard = ({ asset }: QuickAssetCardProps) => {
  const artwork = useMemo(() => buildArtwork(asset.spec), [asset.spec])
  const tone = asset.spec.kind === "icon" ? "checker" : stageTones[asset.spec.palette]
  const { track } = useAnalytics()

  const handleTrack = (format: ExportFormat) => track("brand-download", { kind: asset.spec.kind, format, size: asset.pngSize, source: "quick" })

  return (
    <article className={styles.card}>
      <BrandStage tone={tone} className={styles.stage}>
        <BrandArtwork artwork={artwork} label={asset.title} className={styles.artwork} />
      </BrandStage>
      <div className={styles.body}>
        <h4 className={styles.title}>{asset.title}</h4>
        <p className={styles.description}>{asset.description}</p>
      </div>
      <div className={styles.actions}>
        <ActionButton action={() => downloadArtwork(asset.spec, "svg", asset.pngSize)} toastMessages={{ pending: "Gerando SVG...", success: "SVG baixado", error: "Não foi possível gerar o SVG" }} onDone={() => handleTrack("svg")} ariaLabel={`Baixar SVG: ${asset.title}`}>
          SVG
        </ActionButton>
        <ActionButton action={() => downloadArtwork(asset.spec, "png", asset.pngSize)} toastMessages={{ pending: "Gerando PNG...", success: "PNG baixado", error: "Não foi possível gerar o PNG" }} onDone={() => handleTrack("png")} ariaLabel={`Baixar PNG: ${asset.title}`}>
          PNG ({asset.pngSize} px)
        </ActionButton>
      </div>
    </article>
  )
}

export default QuickAssetCard
