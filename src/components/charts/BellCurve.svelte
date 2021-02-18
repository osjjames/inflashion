<script lang="ts">
    import {Chart, Box, Grid, Svg, SvgLine} from '@sveltejs/pancake';
    import gaussian from 'gaussian';

    const xMax = 100;
    const yMax = 100;

    const mu = 0.5;
    const sigma = 0.05;
    const distribution = gaussian(mu,sigma);
    const probMax = distribution.pdf(mu);
    const gaussianPoints = Array.from(Array(xMax+1).keys()).map(i => ({
        x: i,
        y: distribution.pdf(i/xMax) * (yMax/probMax)
    }));
    const points = [
        { x: 0,  y: 0 },
        { x: 1,  y: 1 },
        { x: 2,  y: 4 },
        { x: 3,  y: 9 },
        { x: 4,  y: 16 },
        { x: 5,  y: 25 },
        { x: 6,  y: 36 },
        { x: 7,  y: 49 },
        { x: 8,  y: 64 },
        { x: 9,  y: 81 },
        { x: 10, y: 100 }
    ];
</script>

<div class="chart">
    <Chart x1={0} x2={xMax} y1={0} y2={yMax}>
        <Box x2={xMax} y2={yMax}>
            <div class="axes"></div>
        </Box>

        <Grid vertical count={5} let:value>
            <span class="x label">{value}</span>
        </Grid>

        <Grid horizontal count={3} let:value let:first>
            <span class="y label">{value}</span>
        </Grid>

        <Svg>
            <SvgLine data={gaussianPoints} let:d>
                <path class="data" {d}/>
            </SvgLine>
        </Svg>
    </Chart>
</div>

<style>
    .chart {
        height: 100%;
        padding: 3em 2em 2em 3em;
        box-sizing: border-box;
    }

    .axes {
        width: 100%;
        height: 100%;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
    }

    .y.label {
        position: absolute;
        left: -2.5em;
        width: 2em;
        text-align: right;
        bottom: -0.5em;
    }

    .x.label {
        position: absolute;
        width: 4em;
        left: -2em;
        bottom: -22px;
        font-family: sans-serif;
        text-align: center;
    }

    path.data {
        stroke: red;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 2px;
        fill: none;
    }
</style>