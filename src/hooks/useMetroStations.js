import {useCallback, useEffect, useState} from "react";
import {randomMinMax} from "../utils/random";


export const useMetroStations = (time) => {
    const [state, setState] = useState([
        [
            {
                x: 200,
                y: 200,
                passengers: [0,1],
                active: false,
                type: 0,
                index: 0,
            },
            {
                x: 500,
                y: 500,
                passengers: [],
                active: false,
                type: 0,
                index: 1,
            },
            {
                x: 500,
                y: 800,
                passengers: [],
                active: false,
                type: 0,
                index: 2,
            },
        ]
    ]);
    const updateStation = useCallback((type, station, n) => {
        const clone = [...state];
        const numberOfPassengers = clone[type][station].passengers.length;

        if (numberOfPassengers) {
            clone[type][station].passengers = clone[type][station].passengers.slice(0, numberOfPassengers - n);

            setState(clone);
        }
    }, [state]);
    const toggleStationActive = useCallback((type, station, override) => {
        const clone = [...state];
        clone[type][station].active = !clone[type][station].active;

        if (override !== undefined) {
            clone[type][station].active = override;
        }

        setState(clone);
    }, [state]);

    useEffect(() => {
        // New symbol every week
        const currentLevel = Math.min(Math.floor(time / (360 * 7)), 4);

        if (time % 30) {
            setState(state => {
               const clone = [...state];
               const lineIndex = randomMinMax(0, clone.length || 0);
               const stationIndex = randomMinMax(0, clone[lineIndex]?.length || 0);

               if (clone?.[lineIndex]?.[stationIndex]?.passengers) {
                   clone[lineIndex][stationIndex].passengers.push(randomMinMax(0, currentLevel));
               }

               return clone;
            });
        }
    }, [time]);

    return [state, updateStation, toggleStationActive];
};
