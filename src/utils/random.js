export const randomMinMax = (min, max, last) => {
    let rtn = Math.floor(Math.random() * (max - min + 1)) + min;
    while (rtn === last) {
        rtn = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return rtn;
};
