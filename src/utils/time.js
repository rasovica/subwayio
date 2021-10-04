// Each day has 360 seconds
export const timeToDay = (time) => Math.floor(time / 360) % 7;
