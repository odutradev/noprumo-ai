import { readableTextOn } from "@utils/functions/brand"
import useAction from "@hooks/useAction"
import styles from "./styles.module.css"

import type { ColorSwatchProps } from "./types"

const toRgb = (hex: string) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)).join(", ")

const ColorSwatch = ({ hex, name, meta, description, isCompact = false }: ColorSwatchProps) => {
  const handleCopy = useAction({
    action: () => navigator.clipboard.writeText(hex),
    toastMessages: { pending: "Copiando...", success: `${hex} copiado`, error: "Não foi possível copiar" }
  })

  if (isCompact)
    return (
      <button type="button" className={styles.chip} style={{ background: hex, color: readableTextOn(hex) }} onClick={handleCopy} aria-label={`Copiar ${name} ${hex}`}>
        <span className={styles.chipStep}>{name}</span>
        <span className={styles.chipHex}>{hex}</span>
      </button>
    )

  return (
    <div className={styles.card}>
      <button type="button" className={styles.color} style={{ background: hex, color: readableTextOn(hex) }} onClick={handleCopy} aria-label={`Copiar ${name} ${hex}`}>
        <span className={styles.hex}>{hex}</span>
        <span className={styles.copy}>Copiar</span>
      </button>
      <div className={styles.body}>
        <strong className={styles.name}>{name}</strong>
        <span className={styles.meta}>
          rgb({toRgb(hex)}){meta ? ` · ${meta}` : ""}
        </span>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  )
}

export default ColorSwatch
