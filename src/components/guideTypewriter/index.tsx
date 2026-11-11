import { useMemo } from "react"

import { buildGuideMarkdown } from "@utils/functions/generator/skillMarkdown"
import { codeGuidePreset } from "@assets/data/generator/presets"
import useInView from "@hooks/useInView"
import styles from "./styles.module.css"

const visibleLines = 24

const lineKind = (line: string) => {
  if (line.startsWith("#")) return "heading"
  if (line.startsWith("|") || line.startsWith("- ") || line.startsWith("**")) return "content"
  return undefined
}

const GuideTypewriter = () => {
  const { ref, isInView } = useInView<HTMLDivElement>(0.3)
  const lines = useMemo(() => buildGuideMarkdown(codeGuidePreset).split("\n").slice(0, visibleLines), [])

  return (
    <div ref={ref} className={styles.window} data-visible={isInView || undefined}>
      <div className={styles.header}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.fileName}>.claude/skills/backend-code-guide/SKILL.md</span>
      </div>
      <pre className={styles.body} tabIndex={0} aria-label="Trecho de um guia gerado pelo noprumo">
        <code>
          {lines.map((line, index) => (
            <span key={index} className={styles.line} data-kind={lineKind(line)} style={{ animationDelay: `${index * 80}ms` }}>
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
