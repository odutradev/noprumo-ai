import { create } from 'zustand'

import { applyThemeClass, getInitialTheme } from '@styles/theme'

import type { SystemState, Theme } from './types'

const initialTheme = getInitialTheme()
applyThemeClass(initialTheme)

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      const nextTheme: Theme = event.matches ? 'dark' : 'light'
      applyThemeClass(nextTheme)
      useSystemStore.setState({ theme: nextTheme, isDarkMode: nextTheme === 'dark' })
    }
  })
}

export const useSystemStore = create<SystemState>((set) => ({
  theme: initialTheme,
  isDarkMode: initialTheme === 'dark',
  toggleTheme: () => {
    set((state) => {
      const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', nextTheme)
      applyThemeClass(nextTheme)
      return {
        theme: nextTheme,
        isDarkMode: nextTheme === 'dark'
      }
    })
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme)
    applyThemeClass(theme)
    set({
      theme,
      isDarkMode: theme === 'dark'
    })
  }
}))
