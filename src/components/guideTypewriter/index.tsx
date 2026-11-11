import { useEffect, useState } from "react"

import useInView from "@hooks/useInView"
import styles from "./styles.module.css"

const visibleLines = 24
const placeholder = Array.from({ length: visibleLines }, () => "")

const lineKind = (line: string) => {
  if (line.startsWith("#")) return "heading"
  if (line.startsWith("|") || line.startsWith("- ") || line.startsWith("**")) return "content"
  return undefined
}

const loadGuideLines = async () => {
  const [{ buildGuideMarkdown }, { codeGuidePreset }] = await Promise.all([import("@utils/functions/generator/skillMarkdown"), import("@assets/data/generator/presets")])
  return buildGuideMarkdown(codeGuidePreset).split("\n").slice(0, visibleLines)
}

const GuideTypewriter = () => {
  const { ref, isInView } = useInView<HTMLDivElement>(0.3)
  const [lines, setLines] = useState<string[] | null>(null)

  useEffect(() => {
    const state = { isActive: true }
    loadGuideLines().then((loaded) => {
      if (state.isActive) setLines(loaded)
    })
    return () => {
      state.isActive = false
    }
  }, [])

  const isReady = lines !== null

  return (
    <div ref={ref} className={styles.window} data-visible={(isInView && isReady) || undefined}>
      <div className={styles.header}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.fileName}>.claude/skills/backend-code-guide/SKILL.md</span>
      </div>
      <pre className={styles.body} tabIndex={0} aria-label="Trecho de um guia gerado pelo noprumo" aria-busy={!isReady}>
        <code>
          {(lines ?? placeholder).map((line, index) => (
            <span key={`${isReady}-${index}`} className={styles.line} data-kind={lineKind(line)} style={{ animationDelay: `${index * 80}ms` }}>
              {line || " "}
            </span>
          ))}
        </code>
        <span className={styles.cursor} aria-hidden="true" />
      </pre>
    </div>
  )
}

export default GuideTypewriter
