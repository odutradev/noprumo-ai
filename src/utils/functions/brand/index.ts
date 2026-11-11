import { contrastRatio } from "enchase/theme"

import { brandBackgrounds, brandColors, brandPalettes, brandRatios, brandTiles, kindsWithFixedFrame, kindsWithTile, symbolGeometry, tileGeometry } from "@assets/data/brand"
import { glyphXHeight, sloganGlyphs, wordmarkGlyphs } from "@assets/data/brand/glyphs"
import { downloadBlob } from "@utils/functions/download"

import type { Artwork, ArtworkColors, ArtworkGroup, ArtworkShape, ArtworkSpec, Bounds, ExportFormat, GeometryPart, GlyphRun, RasterFormat, ShapeRole, SymbolOptical } from "@utils/types/brand"

interface Placed {
  bounds: Bounds
  groups: ArtworkGroup[]
}

const horizontalScale = 2.375
const stackedScale = 4.6
const symbolScale = 10
const lockupGap = 22
const stackedGap = 30
const safeWidth = 0.64
const safeHeight = 0.56
const socialSize = { width: 1200, height: 630 }

const round = (value: number) => Math.round(value * 1000) / 1000

const toShapes = (parts: GeometryPart[], colors: ArtworkColors): ArtworkShape[] =>
  parts
    .map((part) => ({ part, color: colors[part.role] }))
    .filter(({ color }) => color !== "transparent")
    .map(({ part, color }) => (part.strokeWidth ? { d: part.d, stroke: color, strokeWidth: part.strokeWidth } : { d: part.d, fill: color }))

const transformOf = (x: number, y: number, scale: number) => `translate(${round(x)} ${round(y)}) scale(${round(scale)})`

const placeSymbol = (optical: SymbolOptical, colors: ArtworkColors, scale: number, x: number, y: number): Placed => {
  const { bounds, parts } = symbolGeometry[optical]
  return {
    bounds: { left: x + bounds.left * scale, right: x + bounds.right * scale, top: y + bounds.top * scale, bottom: y + bounds.bottom * scale },
    groups: [{ transform: transformOf(x, y, scale), shapes: toShapes(parts, colors) }]
  }
}

const placeGlyphs = (run: GlyphRun, roles: ShapeRole[], colors: ArtworkColors, scale: number, x: number, y: number): Placed => ({
  bounds: { left: x + run.left * scale, right: x + run.right * scale, top: y + run.top * scale, bottom: y + run.bottom * scale },
  groups: [{ transform: transformOf(x, y, scale), shapes: run.segments.map((segment, index) => ({ d: segment.d, fill: colors[roles[index] ?? "ink"] })) }]
})

const merge = (items: Placed[]): Placed => ({
  bounds: {
    left: Math.min(...items.map((item) => item.bounds.left)),
    right: Math.max(...items.map((item) => item.bounds.right)),
    top: Math.min(...items.map((item) => item.bounds.top)),
    bottom: Math.max(...items.map((item) => item.bounds.bottom))
  },
  groups: items.flatMap((item) => item.groups)
})

const move = (placed: Placed, x: number, y: number, scale: number): Placed => ({
  bounds: { left: x + placed.bounds.left * scale, right: x + placed.bounds.right * scale, top: y + placed.bounds.top * scale, bottom: y + placed.bounds.bottom * scale },
  groups: placed.groups.map((group) => ({ ...group, transform: `${transformOf(x, y, scale)} ${group.transform}` }))
})

const wordmarkRoles: ShapeRole[] = ["muted", "ink"]

const sloganRoles: ShapeRole[] = ["ink", "muted", "ink"]

const placeWordmark = (colors: ArtworkColors) => placeGlyphs(wordmarkGlyphs, wordmarkRoles, colors, 1, 0, 0)

const placeHorizontal = (colors: ArtworkColors, optical: SymbolOptical) => {
  const { bounds } = symbolGeometry[optical]
  const symbolX = -bounds.left * horizontalScale
  const symbolY = -glyphXHeight / 2 - 24 * horizontalScale
  const wordmarkX = (bounds.right - bounds.left) * horizontalScale + lockupGap - wordmarkGlyphs.left
  return merge([placeSymbol(optical, colors, horizontalScale, symbolX, symbolY), placeGlyphs(wordmarkGlyphs, wordmarkRoles, colors, 1, wordmarkX, 0)])
}

const placeStacked = (colors: ArtworkColors, optical: SymbolOptical) => {
  const { bounds } = symbolGeometry[optical]
  const textCenter = (wordmarkGlyphs.left + wordmarkGlyphs.right) / 2
  const symbolX = textCenter - 24 * stackedScale
  const symbolY = wordmarkGlyphs.top - stackedGap - bounds.bottom * stackedScale
  return merge([placeSymbol(optical, colors, stackedScale, symbolX, symbolY), placeWordmark(colors)])
}

export const pickTile = (pixelSize?: number) => tileGeometry.find((tile) => (pixelSize ?? Infinity) <= tile.size) ?? tileGeometry[tileGeometry.length - 1]

const placeIcon = (colors: ArtworkColors, pixelSize?: number): Placed => {
  const tile = pickTile(pixelSize)
  return { bounds: { left: 0, right: tile.box, top: 0, bottom: tile.box }, groups: [{ transform: transformOf(0, 0, 1), shapes: toShapes(tile.parts, colors) }] }
}

const placeSocial = (colors: ArtworkColors): Placed => {
  const bob = symbolGeometry.regular.parts[2]
  const bobScale = 5.6
  const lineX = 1000
  const lockup = placeHorizontal(colors, "regular")
  const lockupScale = 0.32
  const sloganScale = 1.05
  const plumb: Placed = {
    bounds: { left: 0, right: socialSize.width, top: 0, bottom: socialSize.height },
    groups: [
      {
        transform: transformOf(0, 0, 1),
        shapes: [
          { d: `M${lineX} 0V430`, stroke: colors.ink, strokeWidth: 3 },
          { d: `M${lineX - 120} 566H${lineX + 120}`, stroke: colors.muted, strokeWidth: 2 }
        ]
      },
      { transform: transformOf(lineX - 24 * bobScale, 410 - 27 * bobScale, bobScale), shapes: [{ d: bob.d, fill: colors.mark }] }
    ]
  }
  return merge([
    plumb,
    move(lockup, 72 - lockup.bounds.left * lockupScale, 72 - lockup.bounds.top * lockupScale, lockupScale),
    placeGlyphs(sloganGlyphs, sloganRoles, colors, sloganScale, 72 - sloganGlyphs.left * sloganScale, 430)
  ])
}

export const pickOptical = (spec: ArtworkSpec): SymbolOptical => {
  if (spec.optical) return spec.optical
  if (!spec.pixelSize || spec.kind === "symbol") return "regular"
  if (spec.pixelSize < 160) return "small"
  if (spec.pixelSize < 320) return "medium"
  return "regular"
}

const colorsOf = (spec: ArtworkSpec): ArtworkColors => {
  if (kindsWithTile.includes(spec.kind)) return (brandTiles.find((tile) => tile.id === spec.tile) ?? brandTiles[0]).colors
  return (brandPalettes.find((palette) => palette.id === spec.palette) ?? brandPalettes[0]).colors
}

const placeContent = (spec: ArtworkSpec, colors: ArtworkColors): Placed => {
  const optical = pickOptical(spec)
  if (spec.kind === "horizontal") return placeHorizontal(colors, optical)
  if (spec.kind === "stacked") return placeStacked(colors, optical)
  if (spec.kind === "symbol") return placeSymbol(optical, colors, symbolScale, 0, 0)
  if (spec.kind === "wordmark") return placeWordmark(colors)
  if (spec.kind === "icon") return placeIcon(colors, spec.pixelSize)
  return placeSocial(colors)
}

const frameOf = (spec: ArtworkSpec, bounds: Bounds) => {
  const contentWidth = bounds.right - bounds.left
  const contentHeight = bounds.bottom - bounds.top
  const ratio = brandRatios.find((item) => item.id === spec.ratio)?.value ?? null
  if (spec.kind === "social") return socialSize
  if (!ratio || kindsWithFixedFrame.includes(spec.kind)) return { width: contentWidth, height: contentHeight }
  const width = Math.max(contentWidth / safeWidth, (contentHeight / safeHeight) * ratio)
  return { width, height: width / ratio }
}

export const buildArtwork = (spec: ArtworkSpec, overrideColors?: ArtworkColors): Artwork => {
  const content = placeContent(spec, overrideColors ?? colorsOf(spec))
  const { bounds } = content
  const frame = frameOf(spec, bounds)
  const offsetX = spec.kind === "social" ? 0 : (frame.width - (bounds.right - bounds.left)) / 2 - bounds.left
  const offsetY = spec.kind === "social" ? 0 : (frame.height - (bounds.bottom - bounds.top)) / 2 - bounds.top
  return {
    width: round(frame.width),
    height: round(frame.height),
    background: brandBackgrounds.find((item) => item.id === spec.background)?.color ?? null,
    groups: content.groups.map((group) => ({ ...group, transform: `${transformOf(offsetX, offsetY, 1)} ${group.transform}` }))
  }
}

const shapeMarkup = (shape: ArtworkShape) =>
  shape.stroke ? `<path d="${shape.d}" fill="none" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth ?? 1}" stroke-linecap="round"/>` : `<path d="${shape.d}" fill="${shape.fill ?? "none"}"/>`

export const serializeArtwork = (artwork: Artwork, size?: { width: number; height: number }) => {
  const width = size?.width ?? artwork.width
  const height = size?.height ?? artwork.height
  const background = artwork.background ? `<rect width="${artwork.width}" height="${artwork.height}" fill="${artwork.background}"/>` : ""
  const groups = artwork.groups.map((group) => `<g transform="${group.transform}">${group.shapes.map(shapeMarkup).join("")}</g>`).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${artwork.width} ${artwork.height}" width="${round(width)}" height="${round(height)}"><title>noprumo</title>${background}${groups}</svg>`
}

export const pixelDimensions = (artwork: Artwork, pixelSize: number) => {
  const scale = pixelSize / Math.max(artwork.width, artwork.height)
  return { width: Math.max(1, Math.round(artwork.width * scale)), height: Math.max(1, Math.round(artwork.height * scale)) }
}

const mimeTypes: Record<ExportFormat, string> = { svg: "image/svg+xml", png: "image/png", webp: "image/webp", jpg: "image/jpeg" }

export const svgBlob = (artwork: Artwork) => new Blob([serializeArtwork(artwork)], { type: mimeTypes.svg })

export const rasterizeArtwork = (artwork: Artwork, pixelSize: number, format: RasterFormat) =>
  new Promise<Blob>((resolve, reject) => {
    const size = pixelDimensions(artwork, pixelSize)
    const url = URL.createObjectURL(new Blob([serializeArtwork(artwork, size)], { type: mimeTypes.svg }))
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = size.width
      canvas.height = size.height
      const context = canvas.getContext("2d")
      if (!context) return reject(new Error("Canvas indisponível"))
      if (format === "jpg" && !artwork.background) {
        context.fillStyle = brandColors.paper
        context.fillRect(0, 0, size.width, size.height)
      }
      context.drawImage(image, 0, 0, size.width, size.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem"))), mimeTypes[format], 0.92)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Falha ao carregar o SVG"))
    }
    image.src = url
  })

export const artworkFileName = (spec: ArtworkSpec, format: ExportFormat, pixelSize?: number) => {
  const color = kindsWithTile.includes(spec.kind) ? spec.tile : spec.palette
  const parts = ["noprumo", spec.kind, color, spec.background === "transparent" ? "" : spec.background, spec.ratio === "original" || kindsWithFixedFrame.includes(spec.kind) ? "" : spec.ratio, format === "svg" || !pixelSize ? "" : `${pixelSize}px`]
  return `${parts.filter(Boolean).join("-").toLowerCase()}.${format}`
}

export const artworkDataUrl = (artwork: Artwork) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serializeArtwork(artwork))}`

export const readableTextOn = (hex: string) => (contrastRatio(brandColors.graphite, hex) >= contrastRatio(brandColors.paper, hex) ? brandColors.graphite : brandColors.paper)

export const exportSpec = (spec: ArtworkSpec, format: ExportFormat, pixelSize: number): ArtworkSpec => ({ ...spec, pixelSize: spec.kind === "icon" || format !== "svg" ? pixelSize : undefined })

export const downloadArtwork = async (spec: ArtworkSpec, format: ExportFormat, pixelSize: number) => {
  const finalSpec = exportSpec(spec, format, pixelSize)
  const artwork = buildArtwork(finalSpec)
  const blob = format === "svg" ? svgBlob(artwork) : await rasterizeArtwork(artwork, pixelSize, format)
  downloadBlob(artworkFileName(finalSpec, format, pixelSize), blob)
}

export const downloadFavicon = async (fileName: string, size: number) => {
  const artwork = buildArtwork({ kind: "icon", palette: "dark", tile: "orange", background: "transparent", ratio: "original", pixelSize: size })
  downloadBlob(fileName, await rasterizeArtwork(artwork, size, "png"))
}

export const downloadFaviconSvg = () => downloadBlob("favicon.svg", svgBlob(buildArtwork({ kind: "icon", palette: "dark", tile: "orange", background: "transparent", ratio: "original", pixelSize: 32 })))
