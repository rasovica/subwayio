export const randomMinMax = (min, max, last) => {
    if (min === max) {
        return min;
    }

    let rtn = Math.floor(Math.random() * (max - min + 1)) + min;
    while (rtn === last) {
        rtn = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return rtn;
};
