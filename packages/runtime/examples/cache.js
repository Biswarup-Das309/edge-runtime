/* global addEventListener, Response */

async function handleRequest(event) {
  const cache = await caches.open('default')
  const { searchParams } = new URL(event.request.url)
  const rawUrl = searchParams.get('url') || 'https://example.vercel.sh'
  let url
  try {
    const parsed = new URL(rawUrl)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return new Response('Invalid URL protocol', { status: 400 })
    }
    url = parsed.toString()
  } catch {
    return new Response('Invalid URL', { status: 400 })
  }

  const cacheKey = new URL(url).toString()
  const request = new Request(cacheKey)

  let response = await cache.match(request)
  const isHIT = !!response

  if (isHIT) {
    response.headers.set('x-cache-status', 'HIT')
    return response
  }

  response = await fetch(cacheKey)
  response.headers.set('x-cache-status', 'MISS')

  event.waitUntil(cache.put(cacheKey, response.clone()))
  return response
}

addEventListener('fetch', (event) => {
  try {
    return event.respondWith(handleRequest(event))
  } catch (e) {
    return event.respondWith(
      new Response('Internal Server Error', { status: 500 }),
    )
  }
})
