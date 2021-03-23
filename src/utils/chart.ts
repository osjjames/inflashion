import {ASAP, LTD, LTOB, LTTB, XYDataPoint} from "downsample";
import {precision} from "./protocol";

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
        this._maxPoints = 256;
    }

    private downsample = (factor: number) => {
        // Get the array with the remainder chopped off
        const remainder = this._all.length % factor;
        const truncatedAll = this._all.slice(0, this._all.length - remainder);

        const downsampledIndexable = LTTB(truncatedAll, Math.floor(truncatedAll.length / factor));
        let downsampled: Point2[] = [];
        for (let i = 0; i < downsampledIndexable.length; i++) {
            let point = downsampledIndexable[i] as Point2;
            downsampled.push(point);
        }
        return downsampled;
    }

    public sliceToWindow = (window: WindowLength) => {
        // const window = Math.min(getWindow(windowLength, maxLength), array.length);
        // if (window > maxPoints) {
        //     console.log('gfeg');
        //     const divisor = Math.floor(array.length / maxPoints);
        //     const snippedArray = array.slice(0, maxPoints*divisor);
        //     const downsampled = LTTB(snippedArray, Math.floor(array.length / divisor));
        //     const slicedDownsampled = [];
        //     console.log(window);
        //     console.log(downsampled.length);
        //     if (downsampled.length > maxPoints) {
        //         for (let i = downsampled.length - window; i < downsampled.length; i++) {
        //             if (downsampled[i] !== undefined) {
        //                 console.log(i);
        //                 console.log(downsampled[i]);
        //                 slicedDownsampled.push(downsampled[i]);
        //             }
        //         }
        //         console.log(slicedDownsampled);
        //         return slicedDownsampled;
        //     } else {
        //         return downsampled;
        //     }
        // } else {
        //     if (windowLength === 'all') return array;
        //     let sliced = array.slice(0 - window);
        //     return array.slice(0 - window);
        // }

        const windowLength = Math.min(getWindow(window, this._all.length), this._all.length);
        if (window === 'all') {
            // Window length is constantly growing, so check if we need to downsample again
            // Calculate the integer factor we need to downsample by (i.e. 1 downsampled point for every n points)
            const factor = Math.ceil(windowLength / this._maxPoints);
            if (factor !== this._downsampleFactor) {
                this._downsampleFactor = factor;
                this._downsampled = this.downsample(factor);
            }
        }

        if (window !== this._currentWindow) {
            this._currentWindow = window;

            if (this._maxPoints > windowLength) {
                this._downsampleFactor = 1;
                this._downsampled = [...this._all];
            } else {
                // Calculate the integer factor we need to downsample by (i.e. 1 downsampled point for every n points)
                const factor = Math.ceil(windowLength / this._maxPoints);
                this._downsampleFactor = factor;
                this._downsampled = this.downsample(factor);
            }
        }

        console.log(windowLength);

        return this._downsampled.slice(0 - windowLength);
    }

    public addPoint = (point: Point2) => {
        // Add point to raw data array
        this._all = [...this._all, point];

        if (this._all.length % this._downsampleFactor === 0) {
            // We have enough data to add a new point to our downsampled array
            const newPoint = LTTB(this._all.slice(0-this._downsampleFactor), 1);
            this._downsampled = [...this._downsampled, newPoint[0] as Point2];
        }

        // // Factor to downsample array by, such that it
        // const divisor = Math.floor(this._all.length / maxPoints);
        // if (divisor !== this._currentDivisor) {
        //     this._downsampled = LTTB(, Math.floor(maxPoints * 0.6))
        // }
        //
        // let power = 1;
        // while (Math.ceil(this._all.length / Math.pow(2, power)) > maxPoints) {
        //     const halved = LTTB(this._all, )
        //     this._downsampled = LTTB(sliced, Math.floor(maxPoints * 0.6))
        // }
    }
}