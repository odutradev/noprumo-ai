import { Button, Container, Flex, ThemeToggle, useToast } from 'enchase'

import appConfig from '@/config'

const HomePage = () => {
  const { success } = useToast()

  return (
    <Container as="main">
      <Flex direction="column" align="center" justify="center" gap="1.5rem" style={{ minHeight: '100vh' }}>
        <h1>{appConfig.name}</h1>
        <Flex gap="0.75rem" align="center">
          <Button onClick={() => success('Tudo configurado')}>Testar toast</Button>
          <ThemeToggle />
        </Flex>
      </Flex>
    </Container>
  )
}

export default HomePage
