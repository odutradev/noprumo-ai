import { Button, useToast } from "enchase"
import { CheckIcon } from "enchase/icons"

import { tokenize } from "@utils/functions/highlight"
import styles from "./styles"

import type { CodeBlockProps } from "./types"

const CodeBlock = ({ code, title, copyable = false, plain = false, compact = false, maxHeight }: CodeBlockProps) => {
  const { success, error } = useToast()
  const tokens = plain ? [{ text: code, type: "plain" as const }] : tokenize(code)

  const copy = () =>
    navigator.clipboard
      .writeText(code)
      .then(() => success("Copiado para a área de transferência"))
      .catch(() => error("Não foi possível copiar"))

  return (
    <figure className={styles.block} data-compact={compact || undefined}>
      {(title || copyable) && (
        <figcaption className={styles.header}>
          <span className={styles.title}>{title}</span>
          {copyable && (
            <Button size="sm" variant="ghost" onClick={copy}>
              <CheckIcon size={16} />
              Copiar
            </Button>
          )}
        </figcaption>
      )}
      <pre className={styles.pre} style={maxHeight ? { maxHeight } : undefined} tabIndex={0}>
        <code>
          {tokens.map((token, index) => (
            <span key={index} className={styles[token.type]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}

export default CodeBlock
