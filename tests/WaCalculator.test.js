import { describe, it, expect, test } from 'vitest'
import { WaCalculator } from '../index.js'

describe('options', () => {
	it('can be read', () => {
		const discipline = 'test12'
		const calc = new WaCalculator({ discipline })

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
		const calc = new WaCalculator({ discipline: disc1 })
		const opt1 = calc.getOptions()
		expect(opt1.discipline).toBe(disc1)
		expect(opt1.venueType).toBe('outdoor') // testing defaults

		const disc2 = 'test2'
		calc.setOptions({ discipline: disc2 })
		const opt2 = calc.getOptions()
		expect(opt2.discipline).toBe(disc2)
		expect(opt2.venueType).toBe('outdoor') // others should remain unchanged
	})
})

describe('keys', () => {
	const calc = new WaCalculator()

	it('lists editions', () => {
		const editions = calc.getEditions()

		expect(editions).toBeInstanceOf(Array)
		expect(editions).toContain('2017')
	})

	it('lists disciplines', () => {
		const disciplines = calc.getDisciplines()

		expect(disciplines).toBeInstanceOf(Array)
		expect(disciplines).toContain('100m')
	})
})

describe('coefficients', () => {
	it('returns coefficients', () => {
		const calc = new WaCalculator({
			discipline: '200m',
			gender: 'f',
			venueType: 'outdoor',
			edition: '2017',
		})

		const coefs = calc.getCoefficients()

		expect(coefs).toBeTypeOf('object')
		expect(coefs).toHaveProperty('resultShift')
		expect(coefs).toHaveProperty('conversionFactor')
		expect(coefs).toHaveProperty('pointShift')
	})
})

describe('calculations', () => {
	test('points are correct', () => {
		const calc = new WaCalculator()

		const result = 21.61
		// Discipline not set
		expect(calc.evaluate(result)).toBeNull()

		calc.setOptions({
			edition: '2017',
			venueType: 'outdoor',
			gender: 'm',
			discipline: '200m',
		})

		// No result
		expect(calc.evaluate(null)).toBeNull()
		expect(calc.evaluate(0)).toBeNull()

		// Good cases
		expect(calc.evaluate(result)).toBe(980)

		// Other cases
		calc.setOptions({gender: 'f', electronicMeasurement: true})
		expect(calc.evaluate(result)).toBe(1279)

		calc.setOptions({venueType: 'indoor', gender: 'm'})
		expect(calc.evaluate(result)).toBe(1043)
	})

	it('applies the +.24 correction', () => {
		const calc = new WaCalculator({
			edition: '2017',
			venueType: 'outdoor',
			gender: 'm',
			discipline: '200m',
			electronicMeasurement: true,
		})

		const result = 21.61

		expect(calc.evaluate(result)).toBe(980)

		calc.setOptions({electronicMeasurement: false})
		expect(calc.evaluate(result)).toBe(946)
	})

	it('applies the +.14 correction', () => {
		const calc = new WaCalculator({
			edition: '2017',
			venueType: 'indoor',
			gender: 'm',
			discipline: '300m',
			electronicMeasurement: true,
		})

		const result = 44.0

		expect(calc.evaluate(result)).toBe(353)

		calc.setOptions({electronicMeasurement: false})
		expect(calc.evaluate(result)).toBe(346)
	})

	test('results worse than reference are 0', () => {
		const calc = new WaCalculator({
			edition: '2017',
			venueType: 'outdoor',
			gender: 'm',
			discipline: '300m',
			electronicMeasurement: true,
		})

		const result = 59.0

		expect(calc.evaluate(result)).toBe(0)
	})
})
