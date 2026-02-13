/**
 * Analytics composable for Rybbit integration
 * Provides type-safe, privacy-respecting analytics tracking
 */

export function useAnalytics() {
  /**
   * Check if analytics is available and user has not opted out
   * Respects Do Not Track header and gracefully handles blocked scripts
   */
  const isAvailable = (): boolean => {
    // Respect Do Not Track
    if (navigator.doNotTrack === '1') return false
    // Check if rybbit loaded
    return typeof window.rybbit !== 'undefined'
  }

  /**
   * Track a generic event with optional properties
   * All tracking is wrapped in error boundaries to prevent app crashes
   */
  const trackEvent = (name: string, properties?: Record<string, unknown>) => {
    if (!isAvailable()) return
    try {
      window.rybbit!.event(name, properties)
    } catch (error) {
      console.warn('Analytics event failed:', error)
    }
  }

  /**
   * Track theme changes with context about the trigger
   * @param from - Previous theme value
   * @param to - New theme value
   * @param trigger - How the change was triggered (manual toggle, system preference, initial load)
   */
  const trackThemeChange = (from: string, to: string, trigger: string) => {
    trackEvent('theme_changed', { from, to, trigger })
  }

  /**
   * Track language changes with browser language context
   * @param from - Previous language
   * @param to - New language
   */
  const trackLanguageChange = (from: string, to: string) => {
    trackEvent('language_changed', {
      from,
      to,
      browserLanguage: navigator.language
    })
  }

  /**
   * Track outbound link clicks using rybbit's dedicated outbound tracking
   * @param url - Destination URL
   * @param platform - Platform name (e.g., 'linkedin', 'github')
   */
  const trackOutboundLink = (url: string, platform: string) => {
    if (!isAvailable()) return
    try {
      window.rybbit!.trackOutbound(url, platform, '_blank')
    } catch (error) {
      console.warn('Outbound link tracking failed:', error)
    }
  }

  /**
   * Track email CTA clicks
   */
  const trackEmailClick = () => {
    trackEvent('email_clicked', { location: 'primary_cta' })
  }

  return {
    trackEvent,
    trackThemeChange,
    trackLanguageChange,
    trackOutboundLink,
    trackEmailClick
  }
}
