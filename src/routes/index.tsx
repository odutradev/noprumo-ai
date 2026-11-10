import { BrowserRouter, Routes, Route } from "react-router"

import Generator, { metadata as generatorMetadata } from "@pages/generator"
import NotFound, { metadata as notFoundMetadata } from "@pages/notFound"
import PageLayout from "@components/pageLayout"
import Providers from "@providers"

import type { PageRoute } from "@utils/types/page"

const routes: PageRoute[] = [
  { path: "/", page: Generator, metadata: generatorMetadata },
  { path: "*", page: NotFound, metadata: notFoundMetadata }
]

const Router = () => (
  <BrowserRouter>
    <Providers>
      <Routes>
        {routes.map(({ path, page: Page, metadata }) => (
          <Route key={path} path={path} element={<PageLayout metadata={metadata}><Page /></PageLayout>} />
        ))}
      </Routes>
    </Providers>
  </BrowserRouter>
)

export default Router
