import editions from '../resources/wa/index.js'

// These editions have separate indoor and outdoor books. The 2025 book has
// a single flat list where short track events have their own `_short` keys.
const venueSplitEditions = ['2017', '2022']

// Results in these disciplines are adjusted by +0.24 seconds if the result is
// taken by hand time.
const correction24disciplines = [
	'50m', '55m', '60m', '100m',
	'200m', '50mh', '55mh',
	'60mh', '100mh', '110mh',
]

// Results in these disciplines are adjusted by +0.14 seconds if the result is
// taken by hand time.
//
// Note that the WA Scoring tables' book instructs to only apply this
// correction to 300m, 400m, 400mh, but the author of this package got
// confirmation from WA via email on 2026-06-01 that it's a typo and this
// correction must be applied to 300mh as well.
const correction14disciplines = ['300m', '400m', '300mh', '400mh']

export class WaCalculator {
	options = {
		discipline: null,
		gender: 'm',
		electronicMeasurement: true,
		venueType: 'outdoor',
		trackType: 'long',
		edition: '2017',
	}

	constructor(options = {}) {
		this.setOptions(options)
	}

	setOptions(options) {
		if ('edition' in options)
			this.options.edition = options.edition

		if ('discipline' in options)
			this.options.discipline = options.discipline

		if ('gender' in options)
			this.options.gender = options.gender

		if ('electronicMeasurement' in options)
			this.options.electronicMeasurement = options.electronicMeasurement

		if ('venueType' in options)
			this.options.venueType = options.venueType

		if ('trackType' in options)
			this.options.trackType = options.trackType
	}

	getOptions() {
		return { ...this.options }
	}

	getEditions() {
		return Object.keys(editions)
	}

	getDisciplines() {
		return Object.keys(this.getTables())
	}

	getTables() {
		const { edition, venueType, gender } = this.options

		if (venueSplitEditions.includes(edition))
			return editions[edition]?.[venueType]?.[gender] ?? {}

		return editions[edition]?.[gender] ?? {}
	}

	getCoefficients() {
		const tables = this.getTables()

		let { discipline } = this.options

		// short track twins like `200m_short` exist only where the track length matters
		if ('short' === this.options.trackType && tables[discipline + '_short'])
			discipline += '_short'

		return tables[discipline] ?? {}
	}

	evaluate(result) {
		if (!result)
			return null

		const { resultShift, conversionFactor, pointShift } = this.getCoefficients()

		if (null == resultShift || null == conversionFactor || null == pointShift)
			return null

		if (!this.options.electronicMeasurement) {
			// the correction is the same whether the track is short or long
			const discipline = this.options.discipline?.replace(/_short$/, '')

			if (correction24disciplines.includes(discipline))
				result += 0.24

			if (correction14disciplines.includes(discipline))
				result += 0.14

			// The correction for 500m has been removed in the 2025 edition.
			if (venueSplitEditions.includes(this.options.edition) && '500m' === discipline)
				result += 0.14
		}

		return this.evaluateUsing(result, { resultShift, conversionFactor, pointShift })
	}

	evaluateUsing(result, { resultShift, conversionFactor, pointShift }) {
		const shiftedResult = result + resultShift

		// for some (track) disciplines the resultShift is subtracting "0 points
		// etalon" and shifted result above 0 means no points are awarded
		if (resultShift < 0 && shiftedResult >= 0)
			return 0

		const points = (conversionFactor * shiftedResult * shiftedResult) + pointShift

		if (points <= 0)
			return 0

		return Math.floor(points)
	}
}
