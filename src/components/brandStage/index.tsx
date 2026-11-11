import { brandColors } from "@assets/data/brand"
import styles from "./styles.module.css"

import type { BrandStageProps, BrandStageTone } from "./types"

const toneStyles: Record<BrandStageTone, { backgroundColor?: string; color?: string; borderColor?: string }> = {
  dark: { backgroundColor: brandColors.ink, color: brandColors.mutedDark, borderColor: brandColors.line },
  light: { backgroundColor: brandColors.paper, color: brandColors.mutedLight, borderColor: brandColors.border },
  orange: { backgroundColor: brandColors.orange, color: brandColors.deepOrange, borderColor: brandColors.orange },
  checker: { backgroundColor: brandColors.paper, color: brandColors.mutedLight, borderColor: brandColors.border },
  checkerDark: { backgroundColor: brandColors.ink, color: brandColors.mutedDark, borderColor: brandColors.line }
}

const BrandStage = ({ tone, children, className, style, label }: BrandStageProps) => (
  <div className={[styles.stage, className].filter(Boolean).join(" ")} data-tone={tone} style={{ ...toneStyles[tone], ...style }}>
    {children}
    {label && <span className={styles.label}>{label}</span>}
  </div>
)

export default BrandStage
