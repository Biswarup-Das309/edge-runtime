import type { OutgoingHttpHeaders, ServerResponse } from 'node:http'

interface HeadersLike {
  entries(): IterableIterator<[string, string]>
  getSetCookie(): string[]
}

export function toOutgoingHeaders(headers?: HeadersLike): OutgoingHttpHeaders {
  const outputHeaders: OutgoingHttpHeaders = {}
  if (headers) {
    for (const [name, value] of headers.entries()) {
      outputHeaders[name] =
        name === 'set-cookie' ? headers.getSetCookie() : value
    }
  }
  return outputHeaders
}

export function mergeIntoServerResponse(
  headers: OutgoingHttpHeaders,
  serverResponse: ServerResponse,
) {
  for (const [name, value] of Object.entries(headers)) {
    if (value !== undefined) {
      serverResponse.setHeader(name, value)
    }
  }
}
