import ReactDOM from 'react-dom/client'

import Router from '@routes/index'

const App = () => <Router />

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />)
}
