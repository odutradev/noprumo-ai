export type Theme = 'dark' | 'light'

export interface SystemState {
  theme: Theme
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}
