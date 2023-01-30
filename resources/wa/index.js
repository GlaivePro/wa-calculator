// https://github.com/eslint/eslint/discussions/15305
// import edition2017 from './2017.json' assert {type: 'json'}

// https://stackoverflow.com/a/73747606/2182900
import { readFileSync } from 'fs'
const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)))
const edition2017 = loadJSON('./2017.json')

export default {
	2017: edition2017,
}
