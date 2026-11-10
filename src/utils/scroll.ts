import type { MouseEvent } from 'react'

export const scrollToSection = (
  event: MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>,
  href: string
) => {
  event.preventDefault()

  const targetId = href.replace('#', '')

  if (!targetId) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    return
  }

  const targetElement = document.getElementById(targetId)

  if (targetElement) {
    const headerOffset = 64
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
