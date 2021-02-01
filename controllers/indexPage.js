import { root } from './paths.js'

export default await fetch(root + '/getIndex').then(v => v.json())
