import {useEffect, useState} from "react";
import {randomMinMax} from "../utils/random";


export const useWaterState = (waterLevel) => {
    const [state, setState] = useState([]);

    useEffect(() => {
        switch (waterLevel) {
            case 0:
            default:
                // Generates a simple river line by going from left to right with an absolute x amount and a variable y amount
                // Water board uses 400x225 grid, starting off screen and in the 75% of the middle
                let x= 0;
                let y = randomMinMax(50, 350);
                let direction = 1; // 3 choices Vertical, horizontal, diagonal
                const riverPoints = [[x, y]];

                do  {
                    if (direction === 0) {
                        y = y + randomMinMax(-50, 50);
                    } else if (direction === 1) {
                        x = x + randomMinMax(0, 50);
                    } else {
                        x = x + randomMinMax(0, 50);
                        y = y + randomMinMax(-50, 50);
                    }
                    direction = randomMinMax(0, 2, direction);
                    riverPoints.push([x, y]);
                } while (x < 400);

                setState(riverPoints);
                break;
        }

    }, [waterLevel]);

    return state;
};
