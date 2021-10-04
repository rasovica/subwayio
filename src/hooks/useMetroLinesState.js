import {useState} from "react";
import * as SIMP from "simplify-js";

export const useMetroLinesState = () => {
    const [state, setState] = useState([]); // One dimension for each color, one dimension for stations and 2 for x, y
    const addStation = (line, x, y) => {
        const stations = [...state];

        if (!Array.isArray(stations[line])) {
            stations[line] = [];
        }

        stations[line].push([x, y]);

        if (stations[line].length > 2) {
            stations[line] = SIMP(stations[line].map(i => ({x: i[0], y: i[1]}))).map(i => [i.x, i.y]);
        }

        setState(stations);
    };

    return [state, addStation];
};
