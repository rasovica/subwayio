import {riverWidth} from "../constants";

export const lineSegmentIntersections = (river, metroLine) => {
    // Returns array of one pixel long lines for each intersection with river, currently works O(n*m)
    const intersectionLines = [];
    const aLen = river.length - 1;
    const bLen = metroLine.length -1;

    for (let x = 0; x < aLen; x++) {
        for (let y = 0; y < bLen; y++) {
            const p0 = {
                x: river[x][0],
                y: river[x][1],
            };
            const p1 = {
                x: river[x + 1][0],
                y: river[x + 1][1],
            };
            const p2 = {
                x: metroLine[y][0],
                y: metroLine[y][1],
            } ;
            const p3 = {
                x: metroLine[y + 1][0],
                y: metroLine[y + 1][1],
            };

            const s1_x = p1.x - p0.x;
            const s1_y = p1.y - p0.y;
            const s2_x = p3.x - p2.x;
            const s2_y = p3.y - p2.y;

            const s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
            const t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

            if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                // River is x wide so we calculate intersection +- x to make a tunnel

                intersectionLines.push({
                    x: p0.x + (t * (s1_x - riverWidth * 1.5)),
                    y: p0.y + (t * (s1_y - riverWidth * 1.5)),
                    a: p0.x + (t * (s1_x + riverWidth * 1.5)),
                    b: p0.y + (t * (s1_y + riverWidth * 1.5)),
                });
            }
        }
    }

    return intersectionLines;
}

export const pointBetweenTwoPoints = (pt1, pt2, pt3) => {
    const result = {
        on_projected_line: true,
        on_line: false,
        between_both: false,
        between_x: false,
        between_y: false,
    };

    // Determine if on line interior or exterior
    const x = (pt3.x - pt1.x) / (pt2.x - pt1.x);
    const y = (pt3.y - pt1.y) / (pt2.y - pt1.y);

    // Check if on line equation
    result.on_projected_line = x === y;

    // Check within x bounds
    if (
        (pt1.x <= pt3.x && pt3.x <= pt2.x) ||
        (pt2.x <= pt3.x && pt3.x <= pt1.x)
    ) {
        result.between_x = true;
    }

    // Check within y bounds
    if (
        (pt1.y <= pt3.y && pt3.y <= pt2.y) ||
        (pt2.y <= pt3.y && pt3.y <= pt1.y)
    ) {
        result.between_y = true;
    }

    result.between_both = result.between_x && result.between_y;
    result.on_line = result.on_projected_line && result.between_both;
    return result.on_line;
};
