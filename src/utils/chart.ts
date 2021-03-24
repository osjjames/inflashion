import {LTTB} from "downsample";

export type Point2 = {x: number, y: number};
export type WindowLength = 'week' | 'month' | 'year' | '5year' | 'all';

export const getWindow = (length: WindowLength, maxLength: number): number => {
    switch (length) {
        case 'week': return 7;
        case 'month': return 30;
        case 'year': return 365;
        case '5year': return 1825;
        case 'all': return maxLength;
    }
}

type LineDataProps = {
    initialWindow: WindowLength
}
export class LineData {
    private _all: Point2[];
    private _downsampled: Point2[];
    private _currentWindow: WindowLength;
    private _downsampleFactor: number;
    private readonly _maxPoints: number;

    get all() {return this._all};
    get length() {return this._all.length};
    get maxPoints() {return this._maxPoints};

    constructor(props: LineDataProps) {
        this._all = [];
        this._downsampled = [];
        this._downsampleFactor = 1;
        this._currentWindow = props.initialWindow;
        this._maxPoints = 512;
    }

    private downsample = (factor: number) => {
        // Get the array with the remainder chopped off
        const remainder = this._all.length % factor;
        const truncatedAll = this._all.slice(0, this._all.length - remainder);

        // Downsample
        const downsampledIndexable = LTTB(truncatedAll, Math.floor(truncatedAll.length / factor));

        // Convert to Point2 array
        let downsampled: Point2[] = [];
        for (let i = 0; i < downsampledIndexable.length; i++) {
            let point = downsampledIndexable[i] as Point2;
            downsampled.push(point);
        }
        return downsampled;
    }

    public sliceToWindow = (window: WindowLength) => {
        const windowLength = Math.min(getWindow(window, this._all.length), this._all.length);

        if (this._maxPoints >= windowLength) {
            this._downsampleFactor = 1;
            this._downsampled = [...this._all];
        } else {
            // Calculate the integer factor we need to downsample by (i.e. 1 downsampled point for every n points)
            const factor = Math.ceil(windowLength / this._maxPoints);
            if (factor !== this._downsampleFactor) {
                this._downsampleFactor = factor;
                this._downsampled = this.downsample(factor);
            }
        }

        return this._downsampleFactor === 1
            ? this._all.slice(0 - windowLength)
            : this._downsampled.slice(0 - Math.floor(windowLength / this._downsampleFactor));
    }

    public addPoint = (point: Point2) => {
        // Add point to raw data array
        this._all = [...this._all, point];

        if (this._all.length % this._downsampleFactor === 0) {
            // We have enough data to add a new point to our downsampled array
            const newPoint = LTTB(this._all.slice(0-this._downsampleFactor), 1);
            this._downsampled = [...this._downsampled, newPoint[0] as Point2];
        }
    }
}