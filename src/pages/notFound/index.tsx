import { ButtonLink, Navbar } from "enchase"
import { useLocation } from "react-router"

import LandingFooter from "@components/landingFooter"
import OffPlumbCode from "@components/offPlumbCode"
import PlumbCursor from "@components/plumbCursor"
import NavbarSlot from "@components/navbarSlot"
import { toolPath } from "@assets/data/landing"
import BrandLogo from "@components/brandLogo"
import useNoIndex from "@hooks/useNoIndex"
import CtaLink from "@components/ctaLink"
import styles from "./styles.module.css"
import appConfig from "@assets/config"

import type { PageMetadata } from "@utils/types/page"

export const metadata: PageMetadata = { title: "Página não encontrada" }

const NotFoundPage = () => {
  const { pathname } = useLocation()
  useNoIndex()

  return (
    <div className={styles.root}>
      <PlumbCursor />
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
        <section className={styles.hero} aria-labelledby="not-found-title">
          <div className={styles.guides} aria-hidden="true" />
          <div className={styles.text}>
            <span className={styles.eyebrow}>Erro 404</span>
            <h1 id="not-found-title" className={styles.title}>
              Esta página saiu <span className={styles.light}>do</span> prumo.
            </h1>
            <p className={styles.lead}>O endereço que você abriu não existe ou mudou de lugar. Nada de errado com você: o caminho é que ficou torto.</p>
            <div className={styles.terminal} aria-label="Caminho não encontrado">
              <p className={styles.terminalLine}>
                <span className={styles.prompt}>$</span> cd {pathname}
              </p>
              <p className={styles.terminalError}>noprumo: {pathname}: caminho não encontrado</p>
              <p className={styles.terminalLine}>
                <span className={styles.prompt}>$</span> cd /<span className={styles.caret} aria-hidden="true" />
              </p>
            </div>
            <div className={styles.actions}>
              <CtaLink href="/" size="lg">
                Voltar ao início
              </CtaLink>
              <ButtonLink href={toolPath} size="lg" variant="ghost">
                Criar meu guia
              </ButtonLink>
            </div>
          </div>
          <OffPlumbCode className={styles.code} />
        </section>

        <LandingFooter />
      </main>
    </div>
  )
}

export default NotFoundPage
