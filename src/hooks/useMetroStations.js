import {useCallback, useEffect, useState} from "react";


export const useMetroStations = (time) => {
    const [state, setState] = useState([
        [
            {
                x: 200,
                y: 200,
                passengers: [0,1,2,3,4,5,6],
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

    }, [time]);

    return [state, updateStation, toggleStationActive];
};
