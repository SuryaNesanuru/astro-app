'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { messages, type SupportedLocales } from '@/lib/internationalization/messages'

type I18nContextValue = {
  locale: SupportedLocales
  setLocale: (locale: SupportedLocales) => void
  t: (keyPath: string) => string
}

const I18N_COOKIE_NAME = 'locale'

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'))
  return match ? decodeURIComponent(match[2]) : undefined
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocales>('en')

  useEffect(() => {
    const initial = getCookie(I18N_COOKIE_NAME)
    if (initial && (initial as SupportedLocales) in messages) {
      setLocaleState(initial as SupportedLocales)
    }
  }, [])

  const setLocale = useCallback((next: SupportedLocales) => {
    setLocaleState(next)
    setCookie(I18N_COOKIE_NAME, next)
  }, [])

  const t = useCallback(
    (keyPath: string) => {
      const bundle = messages[locale] as Record<string, unknown>
      const value = getByPath(bundle, keyPath)
      if (typeof value === 'string') return value
      return keyPath
    },
    [locale]
  )

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
