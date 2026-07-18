export const isIOS = () => {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  )
}

export const canShowInstallBanner = () => {
  const lastDismiss = localStorage.getItem('pwa-dismiss')

  if (!lastDismiss) return true

  const days = 7

  return Date.now() - Number(lastDismiss) > days * 24 * 60 * 60 * 1000
}

export const dismissInstallBanner = () => {
  localStorage.setItem('pwa-dismiss', Date.now().toString())
}