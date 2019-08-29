import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import stylus from 'rollup-plugin-stylus-css-modules'
import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const banner = `// vue-zoomer v${ pkg.version } - Jarvis Niu
// https://github.com/jarvisniu/vue-zoomer\n`

export default {
  input: 'src/index.js',
  output: [
    {
      banner,
      file: 'dist/vue-zoomer.esm.js',
      format: 'esm',
    },
    {
      banner,
      file: 'dist/vue-zoomer.js',
      format: 'umd',
      name: 'VueZoomer',
    },
    {
      banner,
      file: 'dist/vue-zoomer.min.js',
      format: 'umd',
      name: 'VueZoomer',
    },
  ],
  plugins: [
    resolve(),
    cjs(),
    stylus(),
    vue({
      needMap: false,
    }),
    terser({
      include: /^.+\.min\.js$/,
    }),
  ],
}
