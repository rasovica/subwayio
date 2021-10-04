import * as Rx from "rxjs";
import {useEffect, useRef, useState} from "react";

import {GameBoard} from "./components/GameBoard";

import './App.css';
import {GameControls} from "./components/GameControls";
import {useMetroStations} from "./hooks/useMetroStations";

function App() {
  const [devMode, setDevMode] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [activeStations, setActiveStations] = useState([]);
  const [waterIntensity, setWaterIntensity] = useState(0);
  const [numberOfColors, setNumberOfColors] = useState(0);
  const [time, setTime] = useState(0);
  const [stations, updateStation, toggleStationActive] = useMetroStations(time);
  const [passengers, setPassengers] = useState(0);
  const [timeMode, setTimeMode] = useState(0);
  const generateWaterSubject = new Rx.Subject();
  const emitWaterGeneration = () => {
    generateWaterSubject.next(waterIntensity);
    setWaterIntensity((waterIntensity + 1) % 5);
  }

  const intervalRef = useRef(0);

  useEffect(() => {
    if (timeMode === 1) {
        intervalRef.current = setInterval(() => {
          setTime(time => time + 1);
        }, 1000);
    } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeMode]);

  useEffect(() => {
    window.onmousedown = (event) => {
      stations.flat().forEach((station) => {
        if (Math.hypot(event.clientX - station.x, event.clientY - station.y) <= 10) {
          toggleStationActive(station.type, station.index, true);
          setActiveStations([station]);
        }
      });
      setMouseDown(true);
    };
    window.onmouseup = () => {
      stations.flat().forEach((station) => {
        toggleStationActive(station.type, station.index, false);
      });
      setMouseDown(false);
    };
    window.onmousemove = (event) => {
      let foundOne = false;

      if (mouseDown) {
        stations.flat().forEach((station) => {
          if (Math.hypot(event.clientX - station.x, event.clientY - station.y) <= 10) {
            foundOne = true;

            if (!activeStations.includes(station)) {
              setActiveStations([activeStations[0], station]);
              toggleStationActive(station.type, station.index, true);
            }
          }
        });
      }

      if (!foundOne && activeStations[1]) {
        setActiveStations([activeStations[0]]);
        toggleStationActive(activeStations[1].type, activeStations[1].index, false);
      }
    };
  }, [stations, mouseDown, activeStations]);

  return (
    <div className="App">
      <button className="devModeButton" onClick={() => setDevMode(!devMode)}/>
        {
          devMode && (
            <div className="devModeContainer">
                <button onClick={() => emitWaterGeneration()}>Generate river</button>
                <button onClick={() => setNumberOfColors((numberOfColors + 1) % 7)}>More colors</button>
            </div>
          )
        }
        <GameBoard generateWater={generateWaterSubject} time={time} passengers={passengers} stations={stations} activeStations={activeStations}/>
        <GameControls numberOfColors={numberOfColors} setTimeMode={setTimeMode} timeMode={timeMode}/>
    </div>
  );
}

export default App;
