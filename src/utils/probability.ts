//https://stackoverflow.com/a/64354200
export const randomTrunc = ({
     range = [-Infinity, Infinity],
     mu,
     sigma
 }) => {
    // Box-Muller transform
    function randomNormals() {
        let u1 = 0,
            u2 = 0;
        //Convert [0,1) to (0,1)
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        const R = Math.sqrt(-2.0 * Math.log(u1));
        const theta = 2.0 * Math.PI * u2;
        return [R * Math.cos(theta), R * Math.sin(theta)];
    }

    // Skew-normal transform
    // If a variate is either below or above the desired range,
    // we recursively call the randomSkewNormal function until
    // a value within the desired range is drawn
    function random(mu, sigma) {
        const [u0, v] = randomNormals();
        const value = mu + sigma * u0;
        if (value < range[0] || value > range[1])
            return random(mu, sigma);
        return value;
    }

    return random(mu, sigma);
}

