import { ButtonLink, Navbar } from "enchase"

import { guideStages, heroWords, toolPath } from "@assets/data/landing"
import GuideTypewriter from "@components/guideTypewriter"
import LandingFooter from "@components/landingFooter"
import StackMarquee from "@components/stackMarquee"
import StepTimeline from "@components/stepTimeline"
import HeroPlumb from "@components/heroPlumb"
import AlignWall from "@components/alignWall"
import BrandLogo from "@components/brandLogo"
import styles from "./styles.module.css"
import Reveal from "@components/reveal"
import appConfig from "@assets/config"

import type { PageMetadata } from "@utils/types/page"

export const metadata: PageMetadata = { title: "Sua IA no prumo" }

const LandingPage = () => (
  <>
    <Navbar
      className={styles.navbar}
      sections={[]}
      logo={<BrandLogo label={appConfig.name} className={styles.logo} />}
      actions={
        <ButtonLink href={toolPath} size="sm">
          Abrir o gerador
        </ButtonLink>
      }
    />

    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.guides} aria-hidden="true" />
        <div className={styles.heroText}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Gratuito por enquanto
          </span>
          <h1 id="hero-title" className={styles.heroTitle}>
            {heroWords.map((word, index) => (
              <span key={word.text} className={styles.word}>
                <span className={styles.wordInner} data-light={word.isLight || undefined} style={{ animationDelay: `${900 + index * 120}ms` }}>
                  {word.text}
                </span>
              </span>
            ))}
          </h1>
          <p className={styles.heroLead}>
            O noprumo transforma os padrões do seu time em um guia que agentes de IA, como o Claude Code, leem e seguem. Defina uma vez: a IA constrói do seu jeito.
          </p>
          <div className={styles.heroActions}>
            <ButtonLink href={toolPath} size="lg">
              Criar meu guia grátis
            </ButtonLink>
            <ButtonLink href="#como-funciona" size="lg" variant="ghost">
              Como funciona
            </ButtonLink>
          </div>
          <p className={styles.heroNote}>Sem cadastro. Leva poucos minutos.</p>
        </div>
        <HeroPlumb className={styles.heroPlumb} />
      </section>

      <section className={styles.section} aria-labelledby="problem-title">
        <Reveal className={styles.sectionHeader}>
          <span className={styles.eyebrow}>O problema</span>
          <h2 id="problem-title" className={styles.sectionTitle}>
            A IA constrói rápido.
            <br />
            Nem sempre reto.
          </h2>
          <p className={styles.sectionLead}>Sem um padrão escrito, cada sessão inventa o seu: arquivo na pasta errada, outro jeito de nomear, commit fora do formato, arquitetura ignorada. E você passa o dia corrigindo.</p>
        </Reveal>
        <AlignWall />
      </section>

      <section id="como-funciona" className={styles.section} aria-labelledby="how-title">
        <Reveal className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Como funciona</span>
          <h2 id="how-title" className={styles.sectionTitle}>
            Do padrão do time
            <br />
            ao guia da IA.
          </h2>
        </Reveal>
        <div className={styles.howGrid}>
          <StepTimeline />
          <div className={styles.howPreview}>
            <GuideTypewriter />
            <p className={styles.caption}>Trecho real de um guia gerado, pronto para o Claude Code ler.</p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="stack-title">
        <Reveal className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Para a sua stack</span>
          <h2 id="stack-title" className={styles.sectionTitle}>Backend, frontend ou fullstack.</h2>
          <p className={styles.sectionLead}>TypeScript, JavaScript ou Go, com os frameworks, bancos e bibliotecas que o seu time já usa. O guia cobre do projeto à publicação.</p>
        </Reveal>
        <StackMarquee />
        <Reveal delay={150}>
          <ol className={styles.stages}>
            {guideStages.map((stage, index) => (
              <li key={stage} className={styles.stage}>
                <span className={styles.stageIndex}>{String(index + 1).padStart(2, "0")}</span>
                {stage}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className={styles.final} aria-labelledby="final-title">
        <HeroPlumb className={styles.finalPlumb} delay={300} initialAngle={10} />
        <Reveal className={styles.finalText}>
          <h2 id="final-title" className={styles.finalTitle}>
            Sua IA <span className={styles.light}>no</span> prumo.
          </h2>
          <p className={styles.sectionLead}>Monte o guia do seu time agora. É grátis por enquanto e não pede cadastro.</p>
          <ButtonLink href={toolPath} size="lg">
            Abrir o gerador
          </ButtonLink>
        </Reveal>
      </section>

      <LandingFooter />
    </main>
  </>
)

export default LandingPage
