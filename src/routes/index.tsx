import { BrowserRouter, Routes, Route } from "react-router"

import Generator from "@pages/generator"
import NotFound from "@pages/notFound"
import Providers from "@providers"

export const Router = () => {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  )
}

export default Router
