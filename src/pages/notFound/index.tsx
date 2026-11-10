import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-on-surface">
      <h1 className="font-headline-md text-headline-md">404</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Page not found</p>
      <Link to="/" className="text-primary hover:underline">
        Go home
      </Link>
    </main>
  )
}

export default NotFoundPage
