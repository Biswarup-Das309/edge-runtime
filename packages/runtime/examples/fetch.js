/* global addEventListener, fetch, Response */

let globalCounter = 0

function createAppendMarquee() {
  let count = -1

  return function (text, bg) {
    ++count

    return `
  <script>
  document.addEventListener('DOMContentLoaded', function (event) {
    const el = document.createElement('marquee')
    el.id = "banner-${count}"
    el.style.background = 'red'
    el.style.color = 'white'
    el.textContent = '${text}'
    el.style.width = '100%'
    el.style.background = '${bg}'
    el.style.color = 'white'
    el.style['font-family'] = 'sans-serif'
    el.style.top = '${30 * count}px'
    el.style.left = '0'
    el.style.margin = '0'
    el.style.border = '0'
    el.style['border-radius'] = '0'
    el.style['font-size'] = '16px'
    el.style.padding = '6px'
    el.style.position = 'fixed'
    el.style.display = 'block'
    el.style['z-index'] = '100000'
    document.querySelector('body').appendChild(el)
  })
  </script>`.trim()
  }
}

async function fetchRequest(url) {
  const response = await fetch(url)
  const content = await response.text()

  const appendMarquee = createAppendMarquee()

  const banners = [
    appendMarquee(
      'Served by Edge Runtime, check: https://github.com/vercel/edge-runtime.',
      '#111',
    ),
    appendMarquee(
      'Breaking news Next.js is powered by Edge Runtime. fetch is here. Polyfills are the lesser evil. ',
      '#333',
    ),
    appendMarquee(
      `Congrats you are the winner #${++globalCounter}!!! YOU WON A TESLA!! Talk to @rauchg`,
      '#444',
    ),
  ]
  return new Response(`${banners.join()}\n${content}`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
    },
  })
}

addEventListener('fetch', (event) => {
  const { searchParams } = new URL(event.request.url)
  const rawUrl = searchParams.get('url') || 'https://example.vercel.sh'
  let url
  try {
    const parsed = new URL(rawUrl)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return event.respondWith(
        new Response('Invalid URL protocol', { status: 400 }),
      )
    }
    url = parsed.toString()
  } catch {
    return event.respondWith(new Response('Invalid URL', { status: 400 }))
  }
  return event.respondWith(fetchRequest(url))
})
