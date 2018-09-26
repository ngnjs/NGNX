import stripCode from 'rollup-plugin-strip-code'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'
import { install } from 'source-map-support'

install()

const outdir = './test/lib'
const NGNX = 'src/core.js'
const DATE = 'src/datetime/core.js'

const NODEONLY = {
  start_comment: 'browser-only',
  end_comment: 'end-browser-only'
}
// const BROWSERONLY = {
//   start_comment: 'node-only',
//   end_comment: 'end-node-only'
// }

// NGNX Development: Standard (Unminified ES6)
export default [{
  input: NGNX,
  plugins: [
    stripCode(NODEONLY),
    replace({
      delimiters: ['[#', '#]'],
      REPLACE_VERSION: pkg.version
    })
  ],
  output: [
    { file: `${outdir}/ngnx.js`, format: 'cjs', sourcemap: true }
  ]
}, {
  input: DATE,
  plugins: [
    stripCode(NODEONLY)
  ],
  output: [
    { file: `${outdir}/ngnx-date.js`, format: 'cjs', sourcemap: true }
  ]
}]
