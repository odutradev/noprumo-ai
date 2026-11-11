import { ButtonLink, Input, Navbar, SegmentedControl } from "enchase"
import { useMemo, useState } from "react"

import { brandProducts, brandSections, brandTiles, colorScales, faviconAssets, iconPreviewSizes, keyColors, logoKinds, misuseExamples, opticalSizes, personalityTraits, playgroundWeights, quickAssets, showcaseKinds, stateColors, themeTokens, typeFamilies, typeScale, usageRules } from "@assets/data/brand"
import { buildArtwork, downloadArtwork, downloadFavicon, downloadFaviconSvg } from "@utils/functions/brand"
import QuickAssetCard from "@components/quickAssetCard"
import DownloadCenter from "@components/downloadCenter"
import SymbolAnatomy from "@components/symbolAnatomy"
import BrandArtwork from "@components/brandArtwork"
import ActionButton from "@components/actionButton"
import BrandSection from "@components/brandSection"
import ColorSwatch from "@components/colorSwatch"
import MisuseCard from "@components/misuseCard"
import BrandStage from "@components/brandStage"
import { toolPath } from "@assets/data/landing"
import BrandLogo from "@components/brandLogo"
import styles from "./styles.module.css"
import appConfig from "@assets/config"

import type { PageMetadata } from "@utils/types/page"

export const metadata: PageMetadata = { title: "Identidade visual" }

const BrandPage = () => {
  const [sampleText, setSampleText] = useState("Defina uma vez. A IA constrói do seu jeito.")
  const [sampleWeight, setSampleWeight] = useState("650")
  const [sampleFamily, setSampleFamily] = useState("sans")

  const heroArtwork = useMemo(() => buildArtwork({ kind: "horizontal", palette: "dark", tile: "ink", background: "transparent", ratio: "original" }), [])

  const heroSymbolArtwork = useMemo(() => buildArtwork({ kind: "symbol", palette: "dark", tile: "ink", background: "transparent", ratio: "original" }), [])

  const showcase = useMemo(
    () =>
      logoKinds
        .filter((kind) => showcaseKinds.includes(kind.id))
        .map((kind) => ({
          ...kind,
          light: buildArtwork({ kind: kind.id, palette: "light", tile: "ink", background: "transparent", ratio: "original" }),
          dark: buildArtwork({ kind: kind.id, palette: "dark", tile: "ink", background: "transparent", ratio: "original" })
        })),
    []
  )

  const tiles = useMemo(() => brandTiles.map((tile) => ({ ...tile, artwork: buildArtwork({ kind: "icon", palette: "dark", tile: tile.id, background: "transparent", ratio: "original" }) })), [])

  const iconScale = useMemo(() => iconPreviewSizes.map((size) => ({ size, artwork: buildArtwork({ kind: "icon", palette: "dark", tile: "ink", background: "transparent", ratio: "original", pixelSize: size }) })), [])

  const clearSpaceArtwork = useMemo(() => buildArtwork({ kind: "horizontal", palette: "light", tile: "ink", background: "transparent", ratio: "original" }), [])

  return (
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
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Manual de marca · identidade visual oficial</span>
            <h1 className={styles.heroTitle}>
              Identidade visual do <span className={styles.heroNo}>no</span>prumo
            </h1>
            <p className={styles.heroLead}>O guia de símbolo, logotipo, cores, tipografia e usos da marca, com todos os arquivos para baixar em SVG, PNG, WEBP e JPG, em vários tamanhos, proporções e cores.</p>
            <div className={styles.heroActions}>
              <ButtonLink href="#downloads">Ir para os downloads</ButtonLink>
              <ActionButton
                variant="outline"
                size="md"
                action={() => downloadArtwork({ kind: "horizontal", palette: "light", tile: "ink", background: "transparent", ratio: "original" }, "svg", 2048)}
                toastMessages={{ pending: "Gerando SVG...", success: "Logo principal baixado", error: "Não foi possível gerar o SVG" }}
              >
                Baixar o logo principal (SVG)
              </ActionButton>
            </div>
          </div>
          <BrandStage tone="dark" className={styles.heroStage}>
            <span className={styles.heroSwing} aria-hidden="true">
              <BrandArtwork artwork={heroSymbolArtwork} className={styles.heroSymbol} />
            </span>
            <BrandArtwork artwork={heroArtwork} label="Logo do noprumo" className={styles.heroLogo} />
          </BrandStage>
        </header>

        <nav className={styles.sectionNav} aria-label="Seções do manual">
          <ul className={styles.sectionList}>
            {brandSections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.sectionLink}>
                  <span className={styles.sectionIndex}>{String(index + 1).padStart(2, "0")}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <BrandSection id="conceito" number="01" title="O conceito" description="Prumo é o fio de prumo: um peso pendurado num fio, a ferramenta do pedreiro que mostra se uma parede está perfeitamente vertical. Estar no prumo é estar alinhado, correto, nos eixos.">
          <div className={styles.conceptGrid}>
            <div className={styles.conceptText}>
              <p>
                O noprumo transforma os padrões de um time em instruções que agentes de IA seguem. A metáfora da marca é a <strong>construção alinhada</strong>: o código, a infra e os produtos que a IA constrói ficam retos, consistentes e no padrão do time.
              </p>
              <p>
                Em inglês, "no" pode ser lido como negação. Por isso o logotipo separa as duas palavras pelo peso: <span className={styles.inlineNo}>no</span> leve e cinza, <strong>prumo</strong> forte. O "no" é a preposição portuguesa: sua IA <em>no</em> prumo.
              </p>
              <p className={styles.slogan}>Sua IA no prumo.</p>
            </div>
            <ul className={styles.traits}>
              {personalityTraits.map((trait) => (
                <li key={trait.title} className={styles.trait}>
                  <strong>{trait.title}</strong>
                  <span>{trait.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </BrandSection>

        <BrandSection id="simbolo" number="02" title="O símbolo" description="Três formas num grid de 48 × 48: a ancoragem, o fio e o peso. O fio é o cursor de texto e o eixo de um diff, a vertical que o dev olha o dia inteiro.">
          <SymbolAnatomy />
          <div className={styles.opticalGrid}>
            <div className={styles.cardBlock}>
              <h3 className={styles.blockTitle}>Versões óticas</h3>
              <p className={styles.blockText}>Em tamanhos pequenos, um desenho único ficaria fino demais. O símbolo tem três versões: abaixo de 48 px some a ancoragem, o fio engrossa e o peso cresce.</p>
              <div className={styles.opticalRow}>
                {opticalSizes.map((item) => (
                  <div key={item.optical} className={styles.opticalItem}>
                    <BrandLogo kind="symbol" optical={item.optical} className={styles[item.sizeClass]} />
                    <span className={styles.caption}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.cardBlock}>
              <h3 className={styles.blockTitle}>Movimento</h3>
              <p className={styles.blockText}>O peso balança e para no prumo. É a única animação da marca: serve de carregamento e de confirmação de que algo ficou alinhado.</p>
              <div className={styles.motionStage}>
                <span className={styles.swing} aria-hidden="true">
                  <BrandLogo kind="symbol" optical="regular" className={styles.motionSymbol} />
                </span>
              </div>
            </div>
          </div>
        </BrandSection>

        <BrandSection id="logotipo" number="03" title="O logotipo e as versões" description="Geist em minúsculas, com tracking de −3,5%: no em 300 e cinza, prumo em 650. As versões abaixo são as únicas oficiais, em fundo claro e escuro.">
          <div className={styles.showcase}>
            {showcase.map((item) => (
              <article key={item.id} className={styles.showcaseItem}>
                <div className={styles.showcaseStages}>
                  <BrandStage tone="light" className={styles.showcaseStage}>
                    <BrandArtwork artwork={item.light} label={`${item.label}, fundo claro`} className={styles.showcaseArtwork} />
                  </BrandStage>
                  <BrandStage tone="dark" className={styles.showcaseStage}>
                    <BrandArtwork artwork={item.dark} label={`${item.label}, fundo escuro`} className={styles.showcaseArtwork} />
                  </BrandStage>
                </div>
                <h3 className={styles.blockTitle}>{item.label}</h3>
                <p className={styles.blockText}>{item.description}</p>
              </article>
            ))}
          </div>
        </BrandSection>

        <BrandSection id="cores" number="04" title="Cores e tokens" description="Uma cor quente que guia, uma fria de apoio e grafite levemente quente. O laranja é escasso: marca, ação principal e foco. Clique em qualquer cor para copiar o HEX.">
          <div className={styles.keyColors}>
            {keyColors.map((color) => (
              <ColorSwatch key={color.hex} hex={color.hex} name={color.name} meta={color.token} description={color.usage} />
            ))}
          </div>
          {colorScales.map((scale) => (
            <div key={scale.name} className={styles.scale}>
              <div className={styles.scaleHeader}>
                <h3 className={styles.blockTitle}>{scale.name}</h3>
                <p className={styles.blockText}>{scale.description}</p>
              </div>
              <div className={styles.scaleRow} style={{ gridTemplateColumns: `repeat(${scale.steps.length}, minmax(0, 1fr))` }}>
                {scale.steps.map((step) => (
                  <ColorSwatch key={step.hex} hex={step.hex} name={step.step} isCompact />
                ))}
              </div>
            </div>
          ))}
          <div className={styles.twoColumns}>
            <div className={styles.cardBlock}>
              <h3 className={styles.blockTitle}>Estados</h3>
              <ul className={styles.stateList}>
                {stateColors.map((state) => (
                  <li key={state.name} className={styles.stateItem}>
                    <span className={styles.stateName}>{state.name}</span>
                    <BrandStage tone="dark" className={styles.stateStage}>
                      <span className={styles.stateSample} style={{ color: state.dark }}>
                        <span className={styles.stateDot} style={{ background: state.dark }} />
                        {state.sample}
                      </span>
                      <span className={styles.stateHex}>{state.dark}</span>
                    </BrandStage>
                    <BrandStage tone="light" className={styles.stateStage}>
                      <span className={styles.stateSample} style={{ color: state.light }}>
                        <span className={styles.stateDot} style={{ background: state.light }} />
                        {state.sample}
                      </span>
                      <span className={styles.stateHex}>{state.light}</span>
                    </BrandStage>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.cardBlock}>
              <h3 className={styles.blockTitle}>Tokens de tema</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Token</th>
                      <th scope="col">Escuro</th>
                      <th scope="col">Claro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {themeTokens.map((token) => (
                      <tr key={token.name}>
                        <th scope="row">{token.name}</th>
                        <td>
                          <span className={styles.tokenDot} style={{ background: token.dark }} />
                          {token.dark}
                        </td>
                        <td>
                          <span className={styles.tokenDot} style={{ background: token.light }} />
                          {token.light}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </BrandSection>

        <BrandSection id="tipografia" number="05" title="Tipografia" description="Duas famílias irmãs do Google Fonts. A mesma geometria nas duas faz o código e a interface parecerem uma coisa só.">
          <div className={styles.twoColumns}>
            {typeFamilies.map((family) => (
              <article key={family.name} className={styles.cardBlock} data-mono={family.isMono || undefined}>
                <span className={styles.specimen}>Aa</span>
                <h3 className={styles.blockTitle}>{family.name}</h3>
                <span className={styles.caption}>{family.role}</span>
                <p className={styles.blockText}>{family.description}</p>
                <div className={styles.weights}>
                  {family.weights.map((weight) => (
                    <span key={weight} style={{ fontWeight: weight }}>
                      {weight}
                    </span>
                  ))}
                </div>
                <span className={styles.alphabet}>Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789</span>
              </article>
            ))}
          </div>
          <div className={styles.cardBlock}>
            <h3 className={styles.blockTitle}>Escala</h3>
            <ul className={styles.typeScale}>
              {typeScale.map((item) => (
                <li key={item.name} className={styles.typeRow}>
                  <span className={styles.caption}>
                    {item.name} · {item.spec}
                  </span>
                  <span style={{ fontSize: item.size, fontWeight: item.weight, letterSpacing: item.tracking }} className={styles.typeSample}>
                    {item.sample}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.cardBlock}>
            <h3 className={styles.blockTitle}>Teste a tipografia</h3>
            <div className={styles.playgroundControls}>
              <Input label="Sua frase" labelPlacement="stacked" fullWidth value={sampleText} onChange={(event) => setSampleText(event.target.value)} />
              <SegmentedControl
                label="Família"
                items={[
                  { value: "sans", label: "Geist" },
                  { value: "mono", label: "Geist Mono" }
                ]}
                value={sampleFamily}
                onValueChange={(value: string) => setSampleFamily(value)}
              />
              <SegmentedControl label="Peso" items={playgroundWeights} value={sampleWeight} onValueChange={(value: string) => setSampleWeight(value)} />
            </div>
            <p className={styles.playground} data-mono={sampleFamily === "mono" || undefined} style={{ fontWeight: Number(sampleWeight) }}>
              {sampleText || "Digite uma frase"}
            </p>
          </div>
        </BrandSection>

        <BrandSection id="icone" number="06" title="Ícone do app e favicon" description="O símbolo dentro de um bloco com cantos de 22,5%. Três desenhos para três faixas de tamanho: em 16 px tudo cai no grid de pixels.">
          <div className={styles.tiles}>
            {tiles.map((tile) => (
              <article key={tile.id} className={styles.tileItem}>
                <BrandArtwork artwork={tile.artwork} label={`Ícone ${tile.label}`} className={styles.tileArtwork} />
                <h3 className={styles.blockTitle}>{tile.label}</h3>
                <p className={styles.blockText}>{tile.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.twoColumns}>
            <div className={styles.cardBlock}>
              <h3 className={styles.blockTitle}>Em tamanho real</h3>
              <div className={styles.iconScale}>
                {iconScale.map((item) => (
                  <div key={item.size} className={styles.opticalItem}>
                    <BrandArtwork artwork={item.artwork} label={`Ícone em ${item.size} px`} className={styles.realSize} />
                    <span className={styles.caption}>{item.size} px</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.cardBlock}>
              <h3 className={styles.blockTitle}>Pacote de favicons</h3>
              <p className={styles.blockText}>Os mesmos arquivos que este site usa. Coloque-os na pasta pública do projeto.</p>
              <ul className={styles.faviconList}>
                <li className={styles.faviconItem}>
                  <span>
                    <strong className={styles.mono}>favicon.svg</strong>
                    <span className={styles.caption}> · navegadores modernos</span>
                  </span>
                  <ActionButton action={async () => downloadFaviconSvg()} toastMessages={{ pending: "Gerando...", success: "favicon.svg baixado", error: "Não foi possível gerar" }}>
                    Baixar
                  </ActionButton>
                </li>
                {faviconAssets.map((asset) => (
                  <li key={asset.fileName} className={styles.faviconItem}>
                    <span>
                      <strong className={styles.mono}>{asset.fileName}</strong>
                      <span className={styles.caption}>
                        {" "}
                        · {asset.size} px · {asset.description}
                      </span>
                    </span>
                    <ActionButton action={() => downloadFavicon(asset.fileName, asset.size)} toastMessages={{ pending: "Gerando PNG...", success: `${asset.fileName} baixado`, error: "Não foi possível gerar" }}>
                      Baixar
                    </ActionButton>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BrandSection>

        <BrandSection id="familia" number="07" title="Arquitetura de marca" description="Uma casa, vários cômodos. Todo produto usa o mesmo símbolo e a mesma cor; o nome do produto entra depois de uma barra, como um caminho de pasta.">
          <ul className={styles.products}>
            {brandProducts.map((product) => (
              <li key={product.slug} className={styles.product} data-live={product.isLive || undefined}>
                <span className={styles.productStatus}>{product.isLive ? "No ar" : "Futuro"}</span>
                <span className={styles.productName}>
                  <BrandLogo kind="horizontal" optical="medium" className={styles.productLogo} />
                  <span className={styles.productSlash}>/</span>
                  <span className={styles.productSlug}>{product.slug}</span>
                </span>
                <span className={styles.blockText}>{product.description}</span>
              </li>
            ))}
          </ul>
          <div className={styles.cardBlock}>
            <h3 className={styles.blockTitle}>Como escrever</h3>
            <dl className={styles.naming}>
              <dt className={styles.mono}>noprumo/review</dt>
              <dd>No logo e em títulos.</dd>
              <dt className={styles.mono}>noprumo review</dt>
              <dd>Em texto corrido.</dd>
              <dt className={styles.mono}>@noprumo/review</dt>
              <dd>Em pacotes, CLI e repositórios.</dd>
            </dl>
          </div>
        </BrandSection>

        <BrandSection id="usos" number="08" title="Usos corretos e incorretos" description="Regras curtas para a marca chegar inteira em qualquer lugar: área de proteção, tamanho mínimo, fundos e escrita.">
          <div className={styles.twoColumns}>
            <ul className={styles.rules}>
              {usageRules.map((rule) => (
                <li key={rule.title} className={styles.rule}>
                  <strong>{rule.title}</strong>
                  <span className={styles.blockText}>{rule.description}</span>
                </li>
              ))}
            </ul>
            <BrandStage tone="light" className={styles.clearStage} label="área de proteção = altura do x">
              <span className={styles.clearSpace}>
                <BrandArtwork artwork={clearSpaceArtwork} label="Logo com a área de proteção marcada" className={styles.clearArtwork} />
              </span>
            </BrandStage>
          </div>
          <div className={styles.misuse}>
            {misuseExamples.map((example) => (
              <MisuseCard key={example.kind} example={example} />
            ))}
          </div>
        </BrandSection>

        <BrandSection id="downloads" number="09" title="Central de downloads" description="Monte qualquer versão da marca: tipo, cores, fundo, proporção, tamanho e formato. Os SVGs têm o texto convertido em curvas e funcionam sem a fonte instalada.">
          <DownloadCenter />
          <div className={styles.kitHeader}>
            <h3 className={styles.blockTitle}>Kit rápido</h3>
            <p className={styles.blockText}>Os arquivos mais usados, prontos em um clique.</p>
          </div>
          <div className={styles.kit}>
            {quickAssets.map((asset) => (
              <QuickAssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </BrandSection>
      </main>

      <footer className={styles.footer}>
        <BrandLogo className={styles.footerLogo} />
        <span>Identidade visual · versão de novembro de 2026</span>
      </footer>
    </>
  )
}

export default BrandPage
