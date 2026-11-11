import { Navbar } from "enchase"

import { privacySections, privacySummary, privacyUpdatedAt } from "@assets/data/privacy"
import { portfolioUrl, toolPath } from "@assets/data/landing"
import LandingFooter from "@components/landingFooter"
import NavbarSlot from "@components/navbarSlot"
import BrandLogo from "@components/brandLogo"
import CtaLink from "@components/ctaLink"
import styles from "./styles.module.css"
import appConfig from "@assets/config"

import type { PageMetadata } from "@utils/types/page"

export const metadata: PageMetadata = { title: "Privacidade" }

const PrivacyPage = () => (
  <div className={styles.root}>
    <Navbar
      className={styles.navbar}
      sections={[]}
      logo={<BrandLogo label={appConfig.name} className={styles.logo} />}
      actions={
        <CtaLink href={toolPath} size="sm">
          Abrir o gerador
        </CtaLink>
      }
    />
    <NavbarSlot navbarClassName={styles.navbar}>
      <CtaLink href={toolPath} size="sm" isIconOnly>
        Abrir o gerador
      </CtaLink>
    </NavbarSlot>

    <main className={styles.page}>
      <article className={styles.article} aria-labelledby="privacy-title">
        <header className={styles.header}>
          <span className={styles.eyebrow}>Privacidade</span>
          <h1 id="privacy-title" className={styles.title}>
            Seus dados <span className={styles.light}>no</span> prumo.
          </h1>
          <p className={styles.lead}>{privacySummary}</p>
          <p className={styles.updated}>Atualizado em {privacyUpdatedAt}</p>
        </header>

        {privacySections.map((section) => (
          <section key={section.id} className={styles.section} aria-labelledby={`privacy-${section.id}`}>
            <h2 id={`privacy-${section.id}`} className={styles.sectionTitle}>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className={styles.list}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className={styles.section} aria-labelledby="privacy-contact">
          <h2 id="privacy-contact" className={styles.sectionTitle}>
            Contato
          </h2>
          <p className={styles.paragraph}>
            Dúvidas ou pedidos sobre privacidade:{" "}
            <a href={portfolioUrl} target="_blank" rel="noreferrer" className={styles.link}>
              odutra.com
            </a>
            .
          </p>
        </section>
      </article>

      <LandingFooter />
    </main>
  </div>
)

export default PrivacyPage
