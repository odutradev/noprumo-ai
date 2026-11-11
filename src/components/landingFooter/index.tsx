import { portfolioUrl } from "@assets/data/landing"
import BrandLogo from "@components/brandLogo"
import styles from "./styles.module.css"

const LandingFooter = () => (
  <footer className={styles.footer}>
    <BrandLogo label="noprumo" className={styles.logo} />
    <p className={styles.love}>
      Feito com{" "}
      <span className={styles.heart} role="img" aria-label="amor">
        ♥
      </span>{" "}
      por{" "}
      <a href={portfolioUrl} target="_blank" rel="noreferrer" className={styles.link}>
        odutradev
      </a>
    </p>
  </footer>
)

export default LandingFooter
