import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import nl from './locales/nl.json'

export type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'nl'>({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    nl
  }
})

export default i18n