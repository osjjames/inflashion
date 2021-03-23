import {ASAP, LTD, LTOB, LTTB} from "downsample";
import {precision} from "./protocol";

const maxPoints = 256;

export type ChartPoint = {x: number, y: number};
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

// const downsample = (array: any[], w)

export const sliceToWindow = (array: any[], windowLength: WindowLength, maxLength: number) => {
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
    const window = Math.min(getWindow(windowLength, maxLength), array.length);
    const sliced = array.slice(0 - window);
    return sliced.length > maxPoints ? LTTB(sliced, maxPoints) : sliced;
}

type ChartLineProps = {}
export class ChartLine {
    private _all: ChartPoint[];
    private _downsampled: ChartPoint[];
    private _currentDivisor: number = 1;

    constructor(props: ChartLineProps) {

    }

    public addPoint = (point: ChartPoint) => {
        // // Add point to raw data array
        // this._all = [...this._all, point];
        //
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