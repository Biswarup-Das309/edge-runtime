import { help } from '../src/cli/help'

describe('help', () => {
  it('returns a string', () => {
    expect(typeof help()).toBe('string')
  })

  it('includes the edge-runtime command name', () => {
    expect(help()).toContain('edge-runtime')
  })

  it('includes the --eval flag', () => {
    expect(help()).toContain('--eval')
  })

  it('includes the --help flag', () => {
    expect(help()).toContain('--help')
  })

  it('includes the --listen flag', () => {
    expect(help()).toContain('--listen')
  })

  it('includes the --port flag', () => {
    expect(help()).toContain('--port')
  })

  it('includes the --repl flag', () => {
    expect(help()).toContain('--repl')
  })

  it('includes descriptions for each flag', () => {
    const output = help()
    expect(output).toContain('Evaluate an input script')
    expect(output).toContain('Display this message.')
    expect(output).toContain('Run as HTTP server.')
    expect(output).toContain('Specify a port to use.')
    expect(output).toContain('Start an interactive session.')
  })

  it('includes Flags section header', () => {
    expect(help()).toContain('Flags:')
  })
})
