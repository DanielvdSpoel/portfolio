import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import nl from '@/locales/nl.json'

export type MessageSchema = typeof en

function getBrowserLanguage(): string {
  const saved = localStorage.getItem('language')
  if (saved && (saved === 'en' || saved === 'nl')) {
    return saved
  }
  
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('nl')) {
    return 'nl'
  }
  
  return 'en'
}

export const i18n = createI18n<[MessageSchema], 'en' | 'nl'>({
  legacy: false,
  locale: getBrowserLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    nl
  },
  globalInjection: true
})

export function setLanguage(locale: 'en' | 'nl') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (i18n.global.locale as any).value = locale
  localStorage.setItem('language', locale)
  document.documentElement.setAttribute('lang', locale)
}

export default i18n