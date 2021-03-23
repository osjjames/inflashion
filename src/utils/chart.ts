import {ASAP, LTD, LTOB, LTTB} from "downsample";
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

type LineDataProps = {}
export class LineData {
    private _all: Point2[];
    private _downsampled: Point2[];
    private _currentDivisor: number;
    private _maxPoints: number;

    get all() {return this._all};
    get length() {return this._all.length};
    get maxPoints() {return this._maxPoints};

    constructor(props: LineDataProps = {}) {
        this._all = [];
        this._downsampled = [];
        this._currentDivisor = 1;
        this._maxPoints = 256;
    }

    public sliceToWindow = (windowLength: WindowLength) => {
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
        const window = Math.min(getWindow(windowLength, this._all.length), this._all.length);
        const sliced = this._all.slice(0 - window);
        console.log(sliced);
        return sliced.length > this._maxPoints ? LTTB(sliced, this._maxPoints) : sliced;
    }

    public addPoint = (point: Point2) => {
        // Add point to raw data array
        this._all = [...this._all, point];

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