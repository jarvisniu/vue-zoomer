import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import stylus from 'rollup-plugin-stylus-css-modules'
import css from 'rollup-plugin-css-only'
import vue from 'rollup-plugin-vue'

export default {
  input: 'src/index.js',
  output: {
    file: 'esm/vue-zoomer.js',
    format: 'esm',
    name: 'VueZoomer',
  },
  plugins: [
    resolve(),
    cjs(),
    json(),
    stylus(),
    css({
      output: 'esm/vue-zoomer.css',
    }),
    vue(),
  ],
}
