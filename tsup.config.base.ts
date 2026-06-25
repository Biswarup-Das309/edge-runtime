import { Options } from 'tsup'

export const baseConfig: Options = {
  dts: true,
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  tsconfig: './tsconfig.prod.json',
}
