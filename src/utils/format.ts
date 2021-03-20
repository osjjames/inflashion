export const numberWithSpaces = (x: number | string) => {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

// Adapted from https://stackoverflow.com/a/64097019/5086401
export const abbreviateNumber = (x: number, decimals: number = 2) => {
    const units = ["K", "M","B","T","Q"];
    const unit = Math.floor((x / 10).toFixed(0).toString().length)
    const remainder = unit%3;
    let value = Math.abs(x / Math.pow(10, unit-remainder));
    let valueString = value % 1 === 0 ? value.toFixed(0) : Number(value.toFixed(decimals));
    const unitSymbol = units[Math.floor(unit / 3) - 1];
    return unitSymbol === undefined ? x : `${valueString}${unitSymbol}`;
}