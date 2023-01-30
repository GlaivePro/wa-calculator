import editions from '../resources/wa/index.js'

// Results in these disciplines are adjusted by +0.24 seconds if the result is
// taken by hand time.
const correction24disciplines = [
	'50m', '55m', '60m', '100m',
	'200m', '50mh', '55mh',
	'60mh', '100mh', '110mh',
]

// Results in these disciplines are adjusted by +0.14 seconds if the result is
// taken by hand time.
const correction14disciplines = ['300m', '400m', '500m', '400mh']

export class WaCalculator {
	options = {
		discipline: null,
		gender: 'm',
		electronicMeasurement: true,
		venueType: 'outdoor',
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
	}

	getOptions() {
		return { ...this.options }
	}

	getEditions() {
		return Object.keys(editions)
	}

	getDisciplines() {
		const { edition, venueType, gender } = this.options

		return Object.keys(editions[edition][venueType][gender])
	}

	getCoefficients() {
		const { edition, venueType, gender, discipline } = this.options

		return editions[edition][venueType][gender][discipline] ?? {}
	}

	evaluate(result) {
		if (!result)
			return null

		const { resultShift, conversionFactor, pointShift } = this.getCoefficients()

		if (null == resultShift || null == conversionFactor || null == pointShift)
			return null

		if (!this.options.electronicMeasurement) {
			if (correction24disciplines.includes(this.options.discipline))
				result += 0.24

			if (correction14disciplines.includes(this.options.discipline))
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
