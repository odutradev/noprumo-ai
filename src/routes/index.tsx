import { BrowserRouter, Routes, Route } from "react-router"
import { Suspense, lazy } from "react"

import PrivacyNotice from "@components/privacyNotice"
import { privacyPath } from "@assets/data/privacy"
import PageLayout from "@components/pageLayout"
import { toolPath } from "@assets/data/landing"
import Providers from "@providers"

import type { PageRoute } from "@utils/types/page"

const routes: PageRoute[] = [
  { path: "/", page: lazy(() => import("@pages/landing")) },
  { path: toolPath, page: lazy(() => import("@pages/generator")) },
  { path: "/brand", page: lazy(() => import("@pages/brand")) },
  { path: privacyPath, page: lazy(() => import("@pages/privacy")) },
  { path: "*", page: lazy(() => import("@pages/notFound")) }
]

const Router = () => (
  <BrowserRouter>
    <Providers>
      <Suspense fallback={null}>
        <Routes>
          {routes.map(({ path, page: Page }) => (
            <Route key={path} path={path} element={<PageLayout><Page /></PageLayout>} />
          ))}
        </Routes>
      </Suspense>
      <PrivacyNotice />
    </Providers>
  </BrowserRouter>
)

export default Router
