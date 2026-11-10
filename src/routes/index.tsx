import { BrowserRouter, Routes, Route } from 'react-router'

import Providers from '@/providers'
import NotFound from '@pages/notFound'
import Home from '@pages/home'

export const Router = () => {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  )
}

export default Router
