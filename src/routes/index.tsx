import { BrowserRouter, Routes, Route } from "react-router"

import Generator, { metadata as generatorMetadata } from "@pages/generator"
import NotFound, { metadata as notFoundMetadata } from "@pages/notFound"
import Landing, { metadata as landingMetadata } from "@pages/landing"
import Brand, { metadata as brandMetadata } from "@pages/brand"
import PageLayout from "@components/pageLayout"
import { toolPath } from "@assets/data/landing"
import Providers from "@providers"

import type { PageRoute } from "@utils/types/page"

const routes: PageRoute[] = [
  { path: "/", page: Landing, metadata: landingMetadata },
  { path: toolPath, page: Generator, metadata: generatorMetadata },
  { path: "/id", page: Brand, metadata: brandMetadata },
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
