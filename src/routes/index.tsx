import { BrowserRouter, Routes, Route } from 'react-router-dom'

import NotFound from '@pages/notFound'
import Home from '@pages/home'

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
