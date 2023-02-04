export class WaCalculator {
    constructor(options?: {});
    options: {
        discipline: any;
        gender: string;
        electronicMeasurement: boolean;
        venueType: string;
        edition: string;
    };
    setOptions(options: any): void;
    getOptions(): {
        discipline: any;
        gender: string;
        electronicMeasurement: boolean;
        venueType: string;
        edition: string;
    };
    getEditions(): string[];
    getDisciplines(): string[];
    getCoefficients(): any;
    evaluate(result: any): number;
    evaluateUsing(result: any, { resultShift, conversionFactor, pointShift }: {
        resultShift: any;
        conversionFactor: any;
        pointShift: any;
    }): number;
}
//# sourceMappingURL=WaCalculator.d.ts.map