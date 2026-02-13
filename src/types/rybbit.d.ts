// TypeScript type definitions for Rybbit Analytics API

declare global {
  interface Window {
    rybbit?: RybbitAPI
  }
}

interface RybbitAPI {
  event(name: string, properties?: Record<string, unknown>): void
  trackOutbound(url: string, text?: string, target?: string): void
  identify(userId: string, traits?: Record<string, unknown>): void
  setTraits(traits: Record<string, unknown>): void
  pageview(): void
}

// Event name constants for type safety
export type RybbitEventName =
  | 'theme_changed'
  | 'language_changed'
  | 'email_clicked'
  | 'social_link_clicked'

export {}
