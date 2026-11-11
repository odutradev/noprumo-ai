export interface GlyphSegment {
  d: string
  start: number
  end: number
}

export interface GlyphRun {
  width: number
  left: number
  right: number
  top: number
  bottom: number
  segments: GlyphSegment[]
}

export interface Bounds {
  left: number
  right: number
  top: number
  bottom: number
}

export type ShapeRole = "ink" | "muted" | "mark" | "tile" | "tileBorder"

export interface GeometryPart {
  d: string
  role: ShapeRole
  strokeWidth?: number
}

export interface SymbolGeometry {
  bounds: Bounds
  parts: GeometryPart[]
}

export interface TileGeometry {
  size: number
  box: number
  parts: GeometryPart[]
}

export type SymbolOptical = "regular" | "medium" | "small"

export type LogoKind = "horizontal" | "stacked" | "symbol" | "wordmark" | "icon" | "social"

export type PaletteId = "light" | "dark" | "monoInk" | "monoWhite" | "onOrange" | "monoOrange"

export type TileId = "ink" | "orange" | "paper"

export type BackgroundId = "transparent" | "ink" | "paper" | "white" | "orange"

export type RatioId = "original" | "square" | "feed" | "classic" | "wide" | "story" | "og" | "banner"

export type ExportFormat = "svg" | "png" | "webp" | "jpg"

export type RasterFormat = Exclude<ExportFormat, "svg">

export interface ArtworkColors {
  ink: string
  muted: string
  mark: string
  tile: string
  tileBorder: string
}

export interface BrandPalette {
  id: PaletteId
  label: string
  description: string
  colors: ArtworkColors
}

export interface BrandTile {
  id: TileId
  label: string
  description: string
  colors: ArtworkColors
}

export interface BrandBackground {
  id: BackgroundId
  label: string
  color: string | null
}

export interface BrandRatio {
  id: RatioId
  label: string
  value: number | null
}

export interface LogoKindOption {
  id: LogoKind
  label: string
  description: string
}

export interface ArtworkShape {
  d: string
  fill?: string
  stroke?: string
  strokeWidth?: number
}

export interface ArtworkGroup {
  transform: string
  shapes: ArtworkShape[]
}

export interface Artwork {
  width: number
  height: number
  background: string | null
  groups: ArtworkGroup[]
}

export interface ArtworkSpec {
  kind: LogoKind
  palette: PaletteId
  tile: TileId
  background: BackgroundId
  ratio: RatioId
  pixelSize?: number
  optical?: SymbolOptical
}

export interface ColorStep {
  step: string
  hex: string
}

export interface ColorScale {
  name: string
  description: string
  steps: ColorStep[]
}

export interface KeyColor {
  name: string
  hex: string
  token: string
  usage: string
}

export interface StateColor {
  name: string
  sample: string
  dark: string
  light: string
}

export interface ThemeToken {
  name: string
  dark: string
  light: string
}

export interface QuickAsset {
  id: string
  title: string
  description: string
  spec: ArtworkSpec
  pngSize: number
}

export interface FaviconAsset {
  fileName: string
  size: number
  description: string
}

export interface BrandProduct {
  slug: string
  description: string
  isLive: boolean
}

export interface UsageRule {
  title: string
  description: string
}

export type MisuseKind = "stretch" | "rotate" | "recolor" | "shadow" | "rename" | "busy"

export interface MisuseExample {
  kind: MisuseKind
  title: string
}

export interface TypeFamily {
  name: string
  role: string
  description: string
  weights: number[]
  cssVariable: string
  isMono: boolean
}

export interface TypeScaleItem {
  name: string
  spec: string
  sample: string
  size: string
  weight: number
  tracking: string
}

export interface AnatomyNote {
  title: string
  measure: string
  description: string
}

export interface PersonalityTrait {
  title: string
  description: string
}

export interface OpticalSize {
  optical: SymbolOptical
  label: string
  sizeClass: string
}
