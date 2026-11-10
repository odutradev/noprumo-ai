import { CheckIcon } from "enchase/icons"
import { Button } from "enchase"

import { tokenize } from "@utils/functions/highlight"
import useAction from "@hooks/useAction"
import styles from "./styles"

import type { CodeBlockProps } from "./types"

const CodeBlock = ({ code, title, isCopyable = false, isPlain = false, isCompact = false, maxHeight }: CodeBlockProps) => {
  const tokens = isPlain ? [{ text: code, type: "plain" as const }] : tokenize(code)

  const handleCopy = useAction({
    action: () => navigator.clipboard.writeText(code),
    toastMessages: { pending: "Copiando...", success: "Copiado para a área de transferência", error: "Não foi possível copiar" }
  })

  return (
    <figure className={styles.block} data-compact={isCompact || undefined}>
      {(title || isCopyable) && (
        <figcaption className={styles.header}>
          <span className={styles.title}>{title}</span>
          {isCopyable && (
            <Button size="sm" variant="ghost" onClick={handleCopy}>
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
