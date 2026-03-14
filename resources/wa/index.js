import { readFileSync } from 'node:fs'

export default {
	2017: JSON.parse(
		readFileSync(new URL('./2017.json', import.meta.url))
	),
	2022: JSON.parse(
		readFileSync(new URL('./2022.json', import.meta.url))
	),
}
