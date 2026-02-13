import { ref, onMounted, onUnmounted, readonly } from 'vue'
import { useAnalytics } from './useAnalytics'

export type Theme = 'light' | 'dark'
type ThemeTrigger = 'manual' | 'system' | 'initial'

const theme = ref<Theme>('light')

export function useTheme() {
  const { trackThemeChange } = useAnalytics()

  const setTheme = (newTheme: Theme, trigger: ThemeTrigger = 'manual') => {
    const previousTheme = theme.value
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)

    // Track theme change (skip on initial load to avoid noise)
    if (trigger !== 'initial') {
      trackThemeChange(previousTheme, newTheme, trigger)
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light', 'manual')
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setTheme(savedTheme, 'initial')
    } else if (prefersDark) {
      setTheme('dark', 'initial')
    } else {
      setTheme('light', 'initial')
    }
  }

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light', 'system')
    }
  }

  onMounted(() => {
    initTheme()
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  })

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  })

  return {
    theme: readonly(theme),
    toggleTheme,
  }
}
