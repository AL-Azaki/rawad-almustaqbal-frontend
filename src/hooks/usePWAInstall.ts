import { useCallback, useEffect, useRef, useState } from 'react'
import {
  canShowInstallBanner,
  dismissInstallBanner,
  isIOS,
  isStandalone,
} from '../utils/pwa'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

export function usePWAInstall() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  const [visible, setVisible] = useState(false)
  const [ios, setIOS] = useState(false)
  const [canInstall, setCanInstall] = useState(false)

  const showBanner = useCallback(() => {
    if (!canShowInstallBanner()) return
    if (isStandalone()) return

    if (isIOS()) {
      setVisible(true)
      return
    }

    if (deferredPrompt.current) {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (isStandalone()) return

    setIOS(isIOS())

    const installHandler = (event: Event) => {
      event.preventDefault()

      deferredPrompt.current = event as BeforeInstallPromptEvent
      setCanInstall(true)
    }

    let timer = window.setTimeout(showBanner, 10000)

    const scrollHandler = () => {
      if (window.scrollY > 300) {
        showBanner()
        window.removeEventListener('scroll', scrollHandler)
      }
    }

    window.addEventListener('beforeinstallprompt', installHandler)
    window.addEventListener('scroll', scrollHandler)

    return () => {
      clearTimeout(timer)

      window.removeEventListener(
        'beforeinstallprompt',
        installHandler
      )

      window.removeEventListener(
        'scroll',
        scrollHandler
      )
    }
  }, [showBanner])

  const install = async () => {
    if (!deferredPrompt.current) return

    await deferredPrompt.current.prompt()

    const choice = await deferredPrompt.current.userChoice

    if (choice.outcome === 'accepted') {
      setVisible(false)
    }

    deferredPrompt.current = null
    setCanInstall(false)
  }

  const dismiss = () => {
    dismissInstallBanner()
    setVisible(false)
  }

  return {
    visible,
    ios,
    canInstall,
    install,
    dismiss,
  }
}