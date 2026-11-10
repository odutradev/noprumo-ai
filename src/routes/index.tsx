import { BrowserRouter, Routes, Route } from 'react-router'

import Providers from '@providers'
import NotFound from '@pages/notFound'
import Generator from '@pages/generator'

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
