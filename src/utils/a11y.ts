export function announce(message: string) {
  const el = document.getElementById('a11y-live')
  if (el) {
    el.textContent = ''
    requestAnimationFrame(() => {
      el.textContent = message
    })
  }
}
