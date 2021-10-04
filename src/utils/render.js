import {lineSegmentIntersections} from "./interection";
import {clockFaceColor, clockHandleColor, colors, riverWidth, stationBorderColor, stationColor} from "../constants";
import {timeToDay} from "./time";

export const renderWater = (ctx, waterState) => {
    console.log("Starting water board render");
    ctx.strokeStyle = '#73cced';
    ctx.lineJoin = "bevel";
    ctx.lineWidth = riverWidth;
    ctx.beginPath();

    ctx.moveTo(waterState[0][0], waterState[0][1]);

    waterState.forEach((segment) => {
        ctx.lineTo(segment[0], segment[1]);
    });

    ctx.stroke();

    ctx.strokeStyle = '#c8e4f9';
    ctx.lineWidth = riverWidth / 2;
    ctx.stroke();
};

export const renderMetroLines = (ctx, metroLinesState, waterState) => {
    console.log("Starting metro lines render");
    console.log(metroLinesState[0]);

    metroLinesState.forEach((line, index) => {
        ctx.beginPath();
        ctx.lineJoin = "round";
        ctx.strokeStyle = colors[index];
        ctx.lineWidth = 8;

        ctx.moveTo(line[0][0], line[0][1]);

        line.forEach(segment => {
            ctx.lineTo(segment[0], segment[1]);
        });

        ctx.stroke();

        lineSegmentIntersections(waterState, line).forEach((intersection) => {
            ctx.beginPath();
            ctx.strokeStyle = "#fffffd";
            ctx.lineWidth = 3;
            ctx.moveTo(intersection.x, intersection.y);
            ctx.lineTo(intersection.a, intersection.b);
            ctx.stroke();
        });
    });
};

export const renderClockFace = (ctx, size, time, radius = 45) => {
    console.log("Adding clock face for:", time);

    const x = size.width - 50;
    const y = 70;
    const clockHandleLength = 40;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = clockHandleColor;
    ctx.fillStyle = clockFaceColor;
    ctx.lineWidth = 4;

    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
        const angle = (i - 3) * (Math.PI * 2) / 12;
        ctx.lineWidth = 2;
        ctx.beginPath();

        if (i % 3 === 0) {
            ctx.lineWidth = 4;
        }

        const x1 = x + Math.cos(angle) * clockHandleLength;
        const y1 = y + Math.sin(angle) * clockHandleLength;
        const x2 = x + Math.cos(angle) * (clockHandleLength - (clockHandleLength / 3));
        const y2 = y + Math.sin(angle) * (clockHandleLength - (clockHandleLength / 3));

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.strokeStyle = clockHandleColor;
        ctx.stroke();
    }

    const hourHandleAngle = Math.PI * 2 / 360 * (time % 360 - 90);
    const x2 = x + Math.cos(hourHandleAngle) * (clockHandleLength - (clockHandleLength / 10));
    const y2 = y + Math.sin(hourHandleAngle) * (clockHandleLength - (clockHandleLength / 10));

    ctx.lineWidth = 4;

    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

export const renderTextInfo = (ctx, time, score, size) => {
    ctx.beginPath();
    ctx.font = " bolder 30px sans-serif";
    ctx.textAlign = "right";

    switch (timeToDay(time)) {
        default:
        case 0:
            ctx.fillText("MON", size.width - 110, 65);
            break;
        case 1:
            ctx.fillText("TUE", size.width - 110, 65);
            break;
        case 2:
            ctx.fillText("WEN", size.width - 110, 65);
            break;
        case 3:
            ctx.fillText("THU", size.width - 110, 65);
            break;
        case 4:
            ctx.fillText("FRI", size.width - 110, 65);
            break;
        case 5:
            ctx.fillText("SAT", size.width - 110, 65);
            break;
        case 6:
            ctx.fillText("SUN", size.width - 110, 65);
            break;
    }

    ctx.fillText(score, size.width - 110, 100);
};

export const renderStations = (ctx, stationsArray) => {
    stationsArray.forEach((stations, stationType) => {
        switch (stationType) {
            default:
            case 0:
                stations.forEach(station => {
                    renderCircleStation(ctx, station);

                    if (station.passengers.length > 0) {
                        renderPassengers(ctx, station);
                    }
                });
                break;
        }
    });
};

const renderPassengers = (ctx, station) => {
    const {x, y, passengers} = station;

    passengers.forEach((passenger, index) => {
        ctx.beginPath();
        let offsetX;
        let offsetY;

        switch (index) {
            default:
            case 0:
                offsetX = 20;
                offsetY = -5;
                break;
            case 1:
                offsetX = 32;
                offsetY = -5;
                break;
            case 2:
                offsetX = 44;
                offsetY = -5;
                break;
            case 3:
                offsetX = 56;
                offsetY = 0;
                break;
            case 4:
                offsetX = 44;
                offsetY = 5;
                break;
            case 5:
                offsetX = 32;
                offsetY = 5;
                break;
            case 6:
                offsetX = 20;
                offsetY = 5;
                break;
        }

        ctx.fillStyle = "#4d3739";
        const centerX = station.x + offsetX;
        const centerY = station.y + offsetY;

        switch (passenger) {
            case 0:
            default:
                ctx.arc(centerX, centerY,5,0, 2 * Math.PI);
                ctx.fill();
                break;
            case 1:
                ctx.rect(centerX - 5, centerY - 5, 10, 10);
                ctx.fill();
                break;
            case 2:
                const height = 10 * Math.cos(Math.PI / 6);
                ctx.moveTo(centerX - 5, centerY + height/2);
                ctx.lineTo(centerX - 5, centerY + height/2);
                ctx.lineTo(centerX, centerY - (1 + height/2));
                ctx.lineTo(centerX + 5, centerY + height/2);
                ctx.fill();
                break;
            case 3:
                ctx.moveTo(centerX, centerY - 5);
                ctx.arc(centerX, centerY, 5, -11 * Math.PI / 6, -7 * Math.PI / 6);
                ctx.fill();
                break;
            case 4:
                ctx.moveTo(centerX - 5, centerY -2);
                ctx.rect(centerX -5, centerY - 2, 10, 4);
                ctx.rect(centerX - 2, centerY - 5, 4, 10);
                ctx.fill();
                break;
        }
    });
};

const renderCircleStation = (ctx, station) => {
    ctx.strokeStyle = stationBorderColor;
    ctx.fillStyle = stationColor;
    ctx.lineWidth = 3;

    if (station.active) {
        ctx.lineWidth = 5;
    }

    ctx.beginPath();
    ctx.arc(station.x, station.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
};
