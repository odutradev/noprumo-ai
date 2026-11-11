import { ButtonLink } from "enchase"

import styles from "./styles.module.css"
import appConfig from "@assets/config"

import type { StarCardProps } from "./types"

const starPath = "M12 2.8L14.8 8.6L21.2 9.5L16.6 14L17.7 20.4L12 17.4L6.3 20.4L7.4 14L2.8 9.5L9.2 8.6Z"

const StarCard = ({ className, isCompact = false }: StarCardProps) => (
  <aside className={[styles.card, className].filter(Boolean).join(" ")} data-compact={isCompact || undefined} aria-labelledby="star-card-title">
    <span className={styles.badge} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={styles.star}>
        <path d={starPath} />
      </svg>
    </span>
    <div className={styles.text}>
      <h2 id="star-card-title" className={styles.title}>
        Um projeto gratuito, sem custo nenhum
      </h2>
      <p className={styles.description}>O noprumo é aberto e de graça para todo mundo. Se ele te ajudou, deixe uma estrela no GitHub: é o jeito mais simples de apoiar e fazer o projeto chegar a mais gente.</p>
    </div>
    <ButtonLink href={appConfig.repositoryUrl} target="_blank" rel="noreferrer" variant="outline" size={isCompact ? "md" : "lg"} className={styles.action}>
      <svg viewBox="0 0 24 24" className={styles.buttonStar} aria-hidden="true">
        <path d={starPath} />
      </svg>
      Dar uma estrela no GitHub
    </ButtonLink>
  </aside>
)

export default StarCard
