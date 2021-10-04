import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const GameControls = ({numberOfColors, setTimeMode, timeMode}) => {
  const disabledColors = 6 - numberOfColors;
  const colors = ["yellow", "red", "purple", "blue", "green", "pink", "brown"];

  return (
      <div className="controls">
          <div className="time">
              <div className={`pause${timeMode === 0 ? " active" : ""}`} onClick={() => setTimeMode(0)}>
                  <FontAwesomeIcon icon="pause" />
              </div>
              <div className={`play${timeMode === 1 ? " active" : ""}`} onClick={() => setTimeMode(1)}>
                  <FontAwesomeIcon icon="play" />
              </div>
          </div>
          <div className="colors">
              <>
                  {
                      Array(numberOfColors + 1).fill(1).map((_, index) => (
                          <div key={`enabled color ${index}`} className={`color ${colors[index]}`}/>
                      ))
                  }
                  {
                      Array(disabledColors).fill(1).map((_, index) => (
                        <div key={`disabled color ${index}`} className="color"/>
                      ))
                  }
              </>
          </div>
      </div>
  )
};
