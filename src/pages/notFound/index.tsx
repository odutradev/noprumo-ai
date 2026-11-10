import { ButtonLink, Container, Flex } from "enchase"

const NotFoundPage = () => {
  return (
    <Container as="main">
      <Flex direction="column" align="center" justify="center" gap="1rem" style={{ minHeight: "100vh" }}>
        <h1>404</h1>
        <p>Página não encontrada</p>
        <ButtonLink href="/">Voltar ao início</ButtonLink>
      </Flex>
    </Container>
  )
}

export default NotFoundPage
