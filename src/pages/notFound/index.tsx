import { ButtonLink, Container, Flex } from "enchase"

import type { PageMetadata } from "@utils/types/page"

export const metadata: PageMetadata = { title: "Página não encontrada" }

const NotFoundPage = () => {
  return (
    <Container as="main">
      <Flex direction="column" align="center" justify="center" gap="var(--enchase-space-md)" style={{ minHeight: "100vh" }}>
        <h1>404</h1>
        <p>Página não encontrada</p>
        <ButtonLink href="/">Voltar ao início</ButtonLink>
      </Flex>
    </Container>
  )
}

export default NotFoundPage
