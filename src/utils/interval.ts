// https://stackoverflow.com/a/42240115
type Props = {
    name: string,
    callback: Function,
    interval: number,
    maxFires?: number
}

export type IntervalTimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'RESUMED';

export class IntervalTimer{
    private remaining: number;
    public state: IntervalTimerState;
    private name: string;
    private interval: number;
    private callback: Function;
    private maxFires: number;
    private pausedTime: number;
    private fires: number;
    private lastTimeFired: number;
    private timerId: number;
    private lastPauseTime: number;
    private resumeId: number;

    constructor(props: Props){
        this.remaining = 0;
        this.state = 'IDLE';

        this.name = props.name;
        this.interval = props.interval; //in ms
        this.callback = props.callback;
        this.maxFires = props.maxFires || null;
        this.pausedTime = 0; //how long we've been paused for

        this.fires = 0;
    }

    proxyCallback(){
        if(this.maxFires !== null && this.fires >= this.maxFires){
            this.stop();
            return;
        }
        this.lastTimeFired = new Date().getTime();
        this.fires++;
        this.callback();
    }

    start(){
        this.timerId = setInterval(() => this.proxyCallback(), this.interval);
        this.lastTimeFired = new Date().getTime();
        this.state = 'RUNNING';
        this.fires = 0;
    }

    pause(){
        if (this.state !== 'RUNNING' && this.state !== 'RESUMED') return;

        this.remaining = this.interval - (new Date().getTime() - this.lastTimeFired) + this.pausedTime;
        this.lastPauseTime = new Date().getTime();
        clearInterval(this.timerId);
        clearTimeout(this.resumeId);
        this.state = 'PAUSED';
    }

    resume(){
        if (this.state !== 'PAUSED') return;

        this.pausedTime += new Date().getTime() - this.lastPauseTime;
        this.state = 'RESUMED';
        this.resumeId = setTimeout(() => this.timeoutCallback(), this.remaining);
    }

    timeoutCallback(){
        if (this.state !== 'RESUMED') return;

        this.pausedTime = 0;
        this.proxyCallback();
        this.start();
    }

    stop(){
        if(this.state === 'IDLE') return;

        clearInterval(this.timerId);
        clearTimeout(this.resumeId);
        this.state = 'IDLE';
    }

    //set a new interval to use on the next interval loop
    setInterval(newInterval){

        //if we're running do a little switch-er-oo
        if(this.state === 'RUNNING'){
            this.pause();
            this.interval = newInterval;
            this.resume();
        }
        //if we're already stopped, idle, or paused just switch it
        else{
            this.interval = newInterval;
        }
    }

    setMaxFires(newMax){
        if(newMax != null && this.fires >= newMax){
            this.stop();
        }
        this.maxFires = newMax;
    }
}