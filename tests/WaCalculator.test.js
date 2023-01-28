import { describe, test, it, expect } from 'vitest'
import { WaCalculator } from '../index.js'

describe('options', () => {
	it('can be read', () => {
		const discipline = 'test12'
		const calc = new WaCalculator({discipline})

		const options = calc.getOptions()
		expect(options).toBeTypeOf('object')
		expect(options).toHaveProperty('discipline')
		expect(options).toHaveProperty('gender')
		expect(options).toHaveProperty('electronicMeasurement')
		expect(options).toHaveProperty('venueType')
		expect(options).toHaveProperty('edition')

		expect(options.discipline).toBe(discipline)
		expect(options.venueType).toBe('outdoor') // testing defaults
	})

	it('can be set', () => {
		const disc1 = 'test1'
		const calc = new WaCalculator({discipline: disc1})
		const opt1 = calc.getOptions()
		expect(opt1.discipline).toBe(disc1)
		expect(opt1.venueType).toBe('outdoor') // testing defaults

		const disc2 = 'test2'
		calc.setOptions({discipline: disc2})
		const opt2 = calc.getOptions()
		expect(opt2.discipline).toBe(disc2)
		expect(opt2.venueType).toBe('outdoor') // others should remain unchanged
	})
})

// describe('coefficients', () => {})

describe('keys', () => {
	it('lists editions', () => {
		const calc = new WaCalculator()

		const editions = calc.getEditions()

		expect(editions).toBeInstanceOf(Array)
		expect(editions).toContain('2017')
	})

	it('lists disciplines', () => {
		const calc = new WaCalculator()

		const disciplines = calc.getDisciplines()

		expect(disciplines).toBeInstanceOf(Array)
		expect(disciplines).toContain('100m')
	})
})

// describe('calculations', () => {})
