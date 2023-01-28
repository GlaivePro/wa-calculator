export class WaCalculator {
	options = {
		discipline: null,
		gender: 'm',
		electronicMeasurement: true,
		venueType: 'outdoor',
		edition: '2017',
	}

	constructor(options) {
		this.setOptions(options)
	}

	setOptions(options) {
		if ('discipline' in options)
			this.options.discipline = options.discipline

		if ('gender' in options)
			this.options.gender = options.gender

		if ('electronicMeasurement' in options)
			this.options.electronicMeasurement = options.electronicMeasurement

		if ('venueType' in options)
			this.options.venueType = options.venueType

		if ('edition' in options)
			this.options.edition = options.edition
	}

	getOptions() {
		return { ...this.options }
	}
}
