import {useCallback, useEffect, useRef, useState} from "react";

import {useObservable} from "../hooks/useObservable";
import {useWaterState} from "../hooks/useWaterState";
import {useMetroLinesState} from "../hooks/useMetroLinesState";
import {renderClockFace, renderMetroLines, renderStations, renderTextInfo, renderWater} from "../utils/render";
import {useMetroStations} from "../hooks/useMetroStations";
import * as PF from "pathfinding";
import * as SIMP from "simplify-js";
import {pointBetweenTwoPoints} from "../utils/interection";


export const GameBoard = (props) => {
    const {generateWater, time, passengers, stations, activeStations} = props;
    const canvasRef = useRef();
    const gridRef = useRef();

    const waterIntensity = useObservable(generateWater);
    const [size, setSize] = useState([0, 0]);
    const waterState = useWaterState(waterIntensity);
    const [metroLinesState, addStation] = useMetroLinesState();

    useEffect(() => {
        // Rerender needed
        const width = parseInt(canvasRef.current.width);
        const height = parseInt(canvasRef.current.height);
        const ctx = canvasRef.current.getContext('2d');
        const xWaterRatio = width / 400;
        const yWaterRatio = height / 225;
        const normalizedWater = waterState.map((point) => [point[0] * xWaterRatio, point[1] * yWaterRatio]);
        console.log("Starting re-render");
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();

        if (waterState.length > 0) {
            renderWater(ctx, normalizedWater);
        }

        if (metroLinesState.length > 0) {
            renderMetroLines(ctx, metroLinesState, normalizedWater)
        }

        renderClockFace(ctx, {width, height}, time);
        renderTextInfo(ctx, time, passengers, {width, height});
        renderStations(ctx, stations);
    }, [waterState, size, metroLinesState, time, stations]);

    const updateSize = useCallback((a) => {
        setSize(a);
    }, [setSize]);

    useEffect(() => {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        window.onresize = () => {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            updateSize([window.innerWidth, window.innerHeight]);
        };
    }, [updateSize]);

    useEffect(() => {
        const grid = new PF.Grid(400, 225);

        for (let x = 0; x < 400; x++) {
            for (let y = 0; y < 225; y++) {
                for (let z = 0; z < waterState.length - 1; z++) {
                    if (pointBetweenTwoPoints(waterState[z], waterState[z + 1], [x, y])) {
                        grid.setWeightAt(x, y, 10);
                    }
                }
            }
        }

        gridRef.current = grid;
    }, [waterState])

    useEffect(() => {
        if (gridRef.current && activeStations.length === 2) {
            const gridBackup = gridRef.current.clone();
            const finder = new PF.AStarFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            });

            const path = finder.findPath(activeStations[0].x / 4, activeStations[0].y / 4, activeStations[1].x / 4, activeStations[1].y / 4, gridBackup);

            if (path.length > 0) {
                SIMP(path.map(i => ({x: i[0], y: i[1]}))).forEach(point => addStation(0, point.x * 4, point.y * 4));
            }
        }
    }, [activeStations]);

    return (
        <canvas className="gameBoard" ref={canvasRef}> </canvas>
    )
};
