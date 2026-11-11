import { ButtonLink } from "enchase"

import styles from "./styles.module.css"

import type { CtaLinkProps } from "./types"

const CtaLink = ({ href, size = "lg", children, className }: CtaLinkProps) => (
  <ButtonLink href={href} size={size} className={[styles.cta, className].filter(Boolean).join(" ")}>
    {children}
    <svg viewBox="0 0 16 16" className={styles.arrow} aria-hidden="true">
      <path d="M3 8H12.5M8.5 4L12.5 8L8.5 12" />
    </svg>
  </ButtonLink>
)

export default CtaLink
