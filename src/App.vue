<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SunIcon, MoonIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useTheme } from '@/composables/useTheme'
import { useAnalytics } from '@/composables/useAnalytics'
import { setLanguage } from '@/i18n'
import { ref, onMounted, onUnmounted } from 'vue'

const { theme, toggleTheme } = useTheme()
const { t, locale } = useI18n()
const { trackOutboundLink, trackEmailClick } = useAnalytics()
const showLanguageDropdown = ref(false)

// Analytics event handlers
const handleEmailClick = () => {
  trackEmailClick()
}

const handleSocialClick = (platform: string, url: string) => {
  trackOutboundLink(url, platform)
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-dropdown')) {
    showLanguageDropdown.value = false
  }
}

// Keyboard navigation for language dropdown
const handleDropdownKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    showLanguageDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
    <!-- Skip to content -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 focus:z-50 focus:px-6 focus:py-3 focus:rounded-lg focus:bg-[var(--accent-primary)] focus:text-white focus:font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
    >
      Skip to content
    </a>

    <!-- Header Controls - Compact, minimal -->
    <header class="fixed top-6 right-6 z-10 flex items-center gap-4">
      <!-- Language Selector -->
      <div class="relative language-dropdown" @keydown="handleDropdownKeydown">
        <button
          @click="showLanguageDropdown = !showLanguageDropdown"
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)] transition-all duration-200 rounded-md min-h-[44px]"
          :aria-label="t('ui.switchLanguage')"
          :aria-expanded="showLanguageDropdown"
          aria-haspopup="menu"
        >
          <span>{{ locale.toUpperCase() }}</span>
          <ChevronDownIcon class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showLanguageDropdown }" />
        </button>

        <div
          v-if="showLanguageDropdown"
          role="menu"
          class="absolute top-full right-0 mt-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg shadow-xl min-w-20 dropdown-enter"
        >
          <button
            role="menuitem"
            @click="setLanguage('en'); showLanguageDropdown = false"
            class="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--bg-primary)] focus-visible:bg-[var(--bg-primary)] transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
            :class="{ 'font-semibold text-[var(--accent-primary)]': locale === 'en' }"
          >
            EN
          </button>
          <button
            role="menuitem"
            @click="setLanguage('nl'); showLanguageDropdown = false"
            class="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--bg-primary)] focus-visible:bg-[var(--bg-primary)] transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
            :class="{ 'font-semibold text-[var(--accent-primary)]': locale === 'nl' }"
          >
            NL
          </button>
        </div>
      </div>

      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        class="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)] active:scale-95 transition-all duration-200 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
        :aria-label="theme === 'light' ? t('ui.switchToDark') : t('ui.switchToLight')"
      >
        <SunIcon v-if="theme === 'dark'" class="w-5 h-5" />
        <MoonIcon v-else class="w-5 h-5" />
      </button>
    </header>

    <!-- Main Content - Asymmetric Editorial Layout -->
    <main id="main-content" class="relative">
      <div class="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-24 lg:py-32">
        <!-- Grid Layout: Content on left, photo on right (desktop) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          <!-- Left Column: Main Content -->
          <div class="lg:col-span-8 space-y-[clamp(3rem,8vw,4rem)] animate-entrance">

            <!-- Name & Role -->
            <div class="space-y-4">
              <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] text-[var(--text-primary)]">
                {{ t('name') }}
              </h1>
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-medium text-[var(--accent-primary)]">
                {{ t('role') }}
              </h2>
            </div>

            <!-- Headline -->
            <div class="max-w-2xl animate-entrance-delay-1">
              <p class="text-xl sm:text-2xl lg:text-3xl font-medium text-[var(--text-primary)] leading-snug">
                {{ t('headline') }}
              </p>
            </div>

            <!-- About -->
            <div class="max-w-xl animate-entrance-delay-2">
              <p class="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {{ t('about') }}
              </p>
            </div>

            <!-- CTA Section -->
            <div class="space-y-6 animate-entrance-delay-3">
              <!-- Primary CTA -->
              <div>
                <a
                  :href="`mailto:${t('cta.email')}`"
                  @click="handleEmailClick"
                  class="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 active:translate-y-0 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20 hover:shadow-xl hover:shadow-[var(--accent-primary)]/30"
                >
                  {{ t('cta.primary') }}
                </a>
              </div>

              <!-- Secondary Social Links -->
              <div>
                <p class="text-sm font-medium text-[var(--text-tertiary)] mb-3">
                  {{ t('connect') }}
                </p>
                <div class="flex flex-wrap gap-4 sm:gap-5">
                  <a
                    href="https://www.linkedin.com/in/daniël-van-der-spoel/"
                    @click="handleSocialClick('linkedin', 'https://www.linkedin.com/in/daniël-van-der-spoel/')"
                    :aria-label="t('social.linkedin')"
                    class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] focus-visible:text-[var(--accent-primary)] transition-colors duration-200 text-base sm:text-sm font-medium underline decoration-transparent hover:decoration-current underline-offset-4 py-1 min-h-[44px] flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/danielvdspoel"
                    @click="handleSocialClick('github', 'https://github.com/danielvdspoel')"
                    :aria-label="t('social.github')"
                    class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] focus-visible:text-[var(--accent-primary)] transition-colors duration-200 text-base sm:text-sm font-medium underline decoration-transparent hover:decoration-current underline-offset-4 py-1 min-h-[44px] flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://discord.com/users/253038558942724098"
                    @click="handleSocialClick('discord', 'https://discord.com/users/253038558942724098')"
                    :aria-label="t('social.discord')"
                    class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] focus-visible:text-[var(--accent-primary)] transition-colors duration-200 text-base sm:text-sm font-medium underline decoration-transparent hover:decoration-current underline-offset-4 py-1 min-h-[44px] flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Photo (desktop) -->
          <div class="lg:col-span-4 animate-entrance-delay-1 order-first lg:order-last">
            <div class="relative">
              <img
                src="/profile.jpg"
                alt="Daniël van der Spoel"
                width="400"
                height="400"
                loading="lazy"
                class="w-full max-w-xs mx-auto lg:max-w-none rounded-2xl object-cover aspect-square shadow-2xl shadow-[var(--accent-primary)]/10"
              />
              <!-- Decorative element -->
              <div
                class="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--accent-subtle)] rounded-full -z-10 blur-2xl opacity-60 will-change-transform"
                aria-hidden="true"
              ></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>
