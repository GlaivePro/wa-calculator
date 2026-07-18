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
		expect(options).toHaveProperty('trackType')
		expect(options).toHaveProperty('edition')

		expect(options.discipline).toBe(discipline)
		expect(options.venueType).toBe('outdoor') // testing defaults
		expect(options.trackType).toBe('long')
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
		calc.setOptions({ gender: 'f', electronicMeasurement: true })
		expect(calc.evaluate(result)).toBe(1279)

		calc.setOptions({ venueType: 'indoor', gender: 'm' })
		expect(calc.evaluate(result)).toBe(1043)
	})

	test('points are correct on 2022', () => {
		const calc = new WaCalculator({
			edition: '2022',
			gender: 'm',
			venueType: 'outdoor',
			discipline: '600m',
		})
		expect(calc.evaluate(79.09)).toBe(980)
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

		calc.setOptions({ electronicMeasurement: false })
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

		calc.setOptions({ electronicMeasurement: false })
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

	test('negative points are 0', () => {
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: 'high_jump',
		})

		expect(calc.evaluate(0.5)).toBe(0)
	})

	test('unknown tables evaluate to null', () => {
		const calc = new WaCalculator({
			edition: '2022',
			venueType: 'road',
			gender: 'm',
			discipline: '100m',
		})

		expect(calc.evaluate(11.15)).toBeNull()

		calc.setOptions({ venueType: 'outdoor', edition: '2031' })
		expect(calc.evaluate(11.15)).toBeNull()
	})

	test('lows are correct on 2017', () => {
		const calc = new WaCalculator({
			edition: '2017',
			venueType: 'outdoor',
			gender: 'm',
			discipline: '100m',
			electronicMeasurement: true,
		})

		expect(calc.evaluate(16.80)).toBe(0)
		expect(calc.evaluate(16.79)).toBe(1)
		expect(calc.evaluate(16.72)).toBe(1)
		expect(calc.evaluate(16.71)).toBe(2)
		expect(calc.evaluate(16.66)).toBe(2)
		expect(calc.evaluate(16.65)).toBe(3)
		expect(calc.evaluate(16.60)).toBe(3)
		expect(calc.evaluate(16.59)).toBe(4)
	})

	test('highs are correct on 2022', () => {
		const calc = new WaCalculator({
			edition: '2022',
			venueType: 'outdoor',
			gender: 'm',
			discipline: '4x400m',
			electronicMeasurement: true,
		})

		expect(calc.evaluate(167.49)).toBe(1400)
		expect(calc.evaluate(167.50)).toBe(1399)
		expect(calc.evaluate(167.55)).toBe(1399)
		expect(calc.evaluate(167.56)).toBe(1398)
		expect(calc.evaluate(167.61)).toBe(1398)
		expect(calc.evaluate(167.62)).toBe(1397)
		expect(calc.evaluate(167.67)).toBe(1397)
		expect(calc.evaluate(167.68)).toBe(1396)
	})
})

describe('2025 edition', () => {
	test('points are correct', () => {
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: '200m',
		})

		expect(calc.evaluate(22.62)).toBe(842)
	})

	it('selects the short twin by track type', () => {
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: '200m',
			trackType: 'short',
		})

		expect(calc.evaluate(23.07)).toBe(842)

		// the short table can also be requested explicitly
		calc.setOptions({ discipline: '200m_short', trackType: 'long' })
		expect(calc.evaluate(23.07)).toBe(842)
	})

	it('falls back to the common table where the track length does not matter', () => {
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: '60m',
			trackType: 'long',
		})

		expect(calc.evaluate(7.19)).toBe(845)

		calc.setOptions({ trackType: 'short' })
		expect(calc.evaluate(7.19)).toBe(845)
	})

	it('ignores the venue type', () => {
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: '200m',
			venueType: 'outdoor',
		})

		expect(calc.evaluate(22.62)).toBe(842)

		calc.setOptions({ venueType: 'indoor' })
		expect(calc.evaluate(22.62)).toBe(842)
	})

	it('lists the short twins as disciplines', () => {
		const calc = new WaCalculator({ edition: '2025', gender: 'f' })

		const disciplines = calc.getDisciplines()

		expect(disciplines).toContain('200m')
		expect(disciplines).toContain('200m_short')
		expect(disciplines).not.toContain('60m_short')
		expect(disciplines).not.toContain('high_jump_short')
	})

	it('includes the mixed relays on both tables', () => {
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: 'mixed_4x400m',
		})

		expect(calc.evaluate(224.44)).toBe(842)

		calc.setOptions({ gender: 'f' })
		expect(calc.evaluate(224.44)).toBe(842)
	})

	it('applies the +.24 correction on the short track', () => {
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: '200m',
			trackType: 'short',
			electronicMeasurement: true,
		})

		const electronic = calc.evaluate(23.07)

		calc.setOptions({ electronicMeasurement: false })
		expect(calc.evaluate(23.07 - 0.24)).toBe(electronic)
	})

	it('applies the +.14 correction to 300mh', () => {
		// The book omits 300mh, but WA confirmed via email that it's a typo.
		const calc = new WaCalculator({
			edition: '2025',
			gender: 'm',
			discipline: '300mh',
			electronicMeasurement: true,
		})

		expect(calc.evaluate(39.77)).toBe(842)

		calc.setOptions({ electronicMeasurement: false })
		expect(calc.evaluate(39.77 - 0.14)).toBe(842)
	})

	it('does not apply the 500m correction anymore', () => {
		const calc = new WaCalculator({
			gender: 'm',
			discipline: '500m',
			electronicMeasurement: false,
		})

		// the correction applies up to the 2022 edition...
		calc.setOptions({ edition: '2017', venueType: 'indoor' })
		expect(calc.evaluate(69.0)).toBe(767)

		// ...but not since the 2025 edition
		calc.setOptions({ edition: '2025' })
		expect(calc.evaluate(69.0)).toBe(716)
	})

	it('ignores the track type on older editions', () => {
		const calc = new WaCalculator({
			edition: '2022',
			venueType: 'indoor',
			gender: 'm',
			discipline: '200m',
			trackType: 'long',
		})

		expect(calc.evaluate(23.07)).toBe(842)

		calc.setOptions({ trackType: 'short' })
		expect(calc.evaluate(23.07)).toBe(842)
	})
})
