import { useSystemStore } from '@stores/system'
import Icon from '@components/Icon'
import appConfig from '@/config'

const HomePage = () => {
  const { isDarkMode, toggleTheme } = useSystemStore()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-on-surface">
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg">{appConfig.name}</h1>
      <button
        type="button"
        onClick={toggleTheme}
        className="flex items-center gap-2 px-4 py-2 rounded-lg ghost-border hover-ghost-border"
      >
        <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} className="w-5 h-5" />
        <span className="font-label-caps text-label-caps">Toggle theme</span>
      </button>
    </main>
  )
}

export default HomePage
