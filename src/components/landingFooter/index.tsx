import { portfolioUrl } from "@assets/data/landing"
import VersionChip from "@components/versionChip"
import BrandLogo from "@components/brandLogo"
import styles from "./styles.module.css"
import appConfig from "@assets/config"

const LandingFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.brand}>
      <BrandLogo label={appConfig.name} className={styles.logo} />
      <VersionChip />
    </div>
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
