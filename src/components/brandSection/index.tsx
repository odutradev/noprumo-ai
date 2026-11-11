import styles from "./styles.module.css"

import type { BrandSectionProps } from "./types"

const BrandSection = ({ id, number, title, description, children }: BrandSectionProps) => (
  <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
    <header className={styles.header}>
      <span className={styles.number}>{number}</span>
      <h2 id={`${id}-title`} className={styles.title}>
        {title}
      </h2>
      <p className={styles.description}>{description}</p>
    </header>
    {children}
  </section>
)

export default BrandSection
