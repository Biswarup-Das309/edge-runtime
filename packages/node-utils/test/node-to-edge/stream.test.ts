import { Readable } from 'node:stream'
import { buildToReadableStream } from '../../src/node-to-edge/stream'

const toReadableStream = buildToReadableStream({
  ReadableStream: globalThis.ReadableStream,
  Uint8Array: globalThis.Uint8Array,
})

describe('buildToReadableStream', () => {
  it('converts a Node.js Readable stream to a ReadableStream', async () => {
    const nodeStream = Readable.from(Buffer.from('hello'))
    const webStream = toReadableStream(nodeStream)
    expect(webStream).toBeInstanceOf(ReadableStream)

    const reader = webStream.getReader()
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const result = Buffer.concat(chunks).toString()
    expect(result).toBe('hello')
  })

  it('handles empty streams', async () => {
    const nodeStream = Readable.from([])
    const webStream = toReadableStream(nodeStream)

    const reader = webStream.getReader()
    const { done } = await reader.read()
    expect(done).toBe(true)
  })

  it('handles multiple chunks', async () => {
    const nodeStream = new Readable({
      read() {
        this.push(Buffer.from('chunk1'))
        this.push(Buffer.from('chunk2'))
        this.push(null)
      },
    })

    const webStream = toReadableStream(nodeStream)
    const reader = webStream.getReader()
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const result = Buffer.concat(chunks).toString()
    expect(result).toBe('chunk1chunk2')
  })

  it('propagates errors from the Node stream', async () => {
    const nodeStream = new Readable({
      read() {
        this.destroy(new Error('stream error'))
      },
    })

    const webStream = toReadableStream(nodeStream)
    const reader = webStream.getReader()

    await expect(reader.read()).rejects.toThrow('stream error')
  })
})
