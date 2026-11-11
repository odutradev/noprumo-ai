import { Button, SegmentedControl, Select } from "enchase"
import { useMemo, useState } from "react"

import { brandBackgrounds, brandPalettes, brandRatios, brandTiles, kindsWithFixedFrame, kindsWithTile, logoKinds, pngSizes } from "@assets/data/brand"
import { artworkFileName, buildArtwork, downloadArtwork, exportSpec, pixelDimensions, serializeArtwork } from "@utils/functions/brand"
import BrandArtwork from "@components/brandArtwork"
import BrandStage from "@components/brandStage"
import useAnalytics from "@hooks/useAnalytics"
import useAction from "@hooks/useAction"
import styles from "./styles.module.css"

import type { ArtworkSpec, LogoKind, PaletteId, RasterFormat } from "@utils/types/brand"

const rasterFormats: { value: RasterFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
  { value: "jpg", label: "JPG" }
]

const defaultSizes: Record<LogoKind, number> = { horizontal: 2048, stacked: 2048, symbol: 1024, wordmark: 2048, icon: 512, social: 1200 }

const sizesOf = (kind: LogoKind) => (kind === "icon" ? pngSizes.icon : kind === "social" ? pngSizes.social : pngSizes.default)

const darkPalettes: PaletteId[] = ["dark", "monoWhite"]

const initialSpec: ArtworkSpec = { kind: "horizontal", palette: "light", tile: "ink", background: "transparent", ratio: "original" }

const DownloadCenter = () => {
  const [spec, setSpec] = useState<ArtworkSpec>(initialSpec)
  const [pngSize, setPngSize] = useState(defaultSizes.horizontal)
  const [rasterFormat, setRasterFormat] = useState<RasterFormat>("png")
  const { track } = useAnalytics()
  const isTile = kindsWithTile.includes(spec.kind)
  const isFixedFrame = kindsWithFixedFrame.includes(spec.kind)
  const previewArtwork = useMemo(() => buildArtwork(exportSpec(spec, rasterFormat, pngSize)), [spec, rasterFormat, pngSize])
  const dimensions = pixelDimensions(previewArtwork, pngSize)
  const kindInfo = logoKinds.find((kind) => kind.id === spec.kind) ?? logoKinds[0]
  const colorInfo = isTile ? brandTiles.find((tile) => tile.id === spec.tile) : brandPalettes.find((palette) => palette.id === spec.palette)
  const stageTone = spec.background === "ink" ? "dark" : spec.background === "orange" ? "orange" : spec.background === "transparent" ? (!isTile && darkPalettes.includes(spec.palette) ? "checkerDark" : "checker") : "light"

  const update = (changes: Partial<ArtworkSpec>) => setSpec((current) => ({ ...current, ...changes }))

  const handleKindChange = (value: string) => {
    const kind = logoKinds.find((item) => item.id === value)?.id
    if (!kind) return
    update({ kind })
    setPngSize(defaultSizes[kind])
  }

  const handleColorChange = (value: string) => {
    if (isTile) return update({ tile: brandTiles.find((tile) => tile.id === value)?.id ?? spec.tile })
    return update({ palette: brandPalettes.find((palette) => palette.id === value)?.id ?? spec.palette })
  }

  const handleSvg = useAction({
    action: () => downloadArtwork(spec, "svg", pngSize),
    toastMessages: { pending: "Gerando SVG...", success: "SVG baixado", error: "Não foi possível gerar o SVG" },
    callback: () => track("brand-download", { kind: spec.kind, format: "svg", size: pngSize, source: "center" })
  })

  const handleRaster = useAction({
    action: () => downloadArtwork(spec, rasterFormat, pngSize),
    toastMessages: { pending: `Gerando ${rasterFormat.toUpperCase()}...`, success: `${rasterFormat.toUpperCase()} baixado`, error: "Não foi possível gerar a imagem" },
    callback: () => track("brand-download", { kind: spec.kind, format: rasterFormat, size: pngSize, source: "center" })
  })

  const handleCopy = useAction({
    action: () => navigator.clipboard.writeText(serializeArtwork(buildArtwork(exportSpec(spec, "svg", pngSize)))),
    toastMessages: { pending: "Copiando...", success: "Código SVG copiado", error: "Não foi possível copiar" },
    callback: () => track("brand-copy", { kind: spec.kind })
  })

  return (
    <div className={styles.center}>
      <form className={styles.form} onSubmit={(event) => event.preventDefault()} aria-label="Configurar o arquivo">
        <h3 className={styles.formTitle}>Configurar o arquivo</h3>
        <Select label="Tipo de logo" labelPlacement="stacked" fullWidth value={spec.kind} options={logoKinds.map((kind) => ({ value: kind.id, label: kind.label }))} helperText={kindInfo.description} onChange={(event) => handleKindChange(event.target.value)} />
        <Select
          label={isTile ? "Cor do bloco" : "Paleta de cores"}
          labelPlacement="stacked"
          fullWidth
          value={isTile ? spec.tile : spec.palette}
          options={isTile ? brandTiles.map((tile) => ({ value: tile.id, label: tile.label })) : brandPalettes.map((palette) => ({ value: palette.id, label: palette.label }))}
          helperText={colorInfo?.description}
          onChange={(event) => handleColorChange(event.target.value)}
        />
        <Select label="Fundo" labelPlacement="stacked" fullWidth value={spec.background} options={brandBackgrounds.map((background) => ({ value: background.id, label: background.label }))} onChange={(event) => update({ background: brandBackgrounds.find((background) => background.id === event.target.value)?.id ?? spec.background })} />
        <Select
          label="Proporção"
          labelPlacement="stacked"
          fullWidth
          disabled={isFixedFrame}
          value={isFixedFrame ? "original" : spec.ratio}
          options={brandRatios.map((ratio) => ({ value: ratio.id, label: ratio.label }))}
          helperText={isFixedFrame ? "Este tipo tem um quadro fixo." : "Fora do original, a marca fica centrada com folga de segurança."}
          onChange={(event) => update({ ratio: brandRatios.find((ratio) => ratio.id === event.target.value)?.id ?? spec.ratio })}
        />
        <Select label="Tamanho da imagem" labelPlacement="stacked" fullWidth value={String(pngSize)} options={sizesOf(spec.kind).map((size) => ({ value: String(size), label: `${size} px no lado maior` }))} onChange={(event) => setPngSize(Number(event.target.value))} />
        <SegmentedControl label="Formato da imagem" items={rasterFormats} value={rasterFormat} fullWidth onValueChange={(value: string) => setRasterFormat(rasterFormats.find((format) => format.value === value)?.value ?? "png")} />
      </form>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h3 className={styles.formTitle}>Prévia</h3>
          <span className={styles.meta}>
            {dimensions.width} × {dimensions.height} px
          </span>
        </div>
        <BrandStage tone={stageTone} className={styles.stage}>
          <BrandArtwork artwork={previewArtwork} label={`Prévia: ${kindInfo.label}`} className={styles.artwork} />
        </BrandStage>
        <p className={styles.fileName}>{artworkFileName(exportSpec(spec, rasterFormat, pngSize), rasterFormat, pngSize)}</p>
        <div className={styles.actions}>
          <Button onClick={handleSvg}>Baixar SVG (vetorial)</Button>
          <Button variant="outline" onClick={handleRaster}>
            Baixar {rasterFormat.toUpperCase()} ({pngSize} px)
          </Button>
          <Button variant="ghost" onClick={handleCopy}>
            Copiar SVG
          </Button>
        </div>
        {rasterFormat === "jpg" && spec.background === "transparent" && <p className={styles.hint}>JPG não tem transparência: o fundo sai em papel (#FCFCFB).</p>}
      </div>
    </div>
  )
}

export default DownloadCenter
