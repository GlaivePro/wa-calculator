# WA Calculator

Point calculators for track & field events

For PHP version of this library see [GlaivePro/IaafPoints](https://github.com/GlaivePro/IaafPoints).

## Installation

No CDN support at the moment, you have to import and bundle it yourself.

```sh
npm i @glaivepro/wa-calculator
```

## Usage

```js
import { WaCalculator } from '@glaivepro/wa-calculator'

const options = [
	edition: '2017', // edition of scoring tables, default is '2017' 
	gender: 'm', // 'm' or 'f', default is 'm'
	venueType: 'outdoor', // 'indoor' or 'outdoor', default is 'outdoor'
	electronicMeasurement: true, // whether electronic or hand time was taken, default is true
	discipline: '200m', // no default, see below how to list available keys
];

const calculator = new WaCalculator(options)

// Evaluate a result getting some points or a class assigned to result.
const points = calculator.evaluate(21.61) // 980

// Update options
calculator.setOptions({ gender : 'f' })
const femalePoints = $calculator->evaluate(21.61) // 1279

// Get list of editions
calculator.getEditions()

// Get list of discipline keys available for current edition, venueType and gender
calculator.getDisciplines()
```

Some options for advanced usage:

```js
// Get calculation coefficients for current setup
calculator.getCoefficients()

// Calculate from result using given coefficients
const resultShift = -110
const conversionFactor = 0.335
const pointShift = 0
calculator.evaluateUsing(result, { resultShift, conversionFactor, pointShift })
```

## TODO/wishlist

- [x] WA (Hungarian) points calculator
- [ ] WA (Hungarian) points 2022
- [ ] Combined points calculator
- [ ] Dist for browser support
- [ ] TS support
