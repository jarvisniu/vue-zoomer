import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import stylus from 'rollup-plugin-stylus-css-modules'
import vue from 'rollup-plugin-vue'

let plugins = [
  resolve(),
  cjs(),
  stylus(),
  vue({
    needMap: false,
  }),
]

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vue-zoomer.js',
      format: 'umd',
      name: 'VueZoomer',
    },
    plugins,
  }, {
    input: 'src/index.js',
    output: {
      file: 'dist/vue-zoomer.esm.js',
      format: 'esm',
    },
    plugins,
  },
]
