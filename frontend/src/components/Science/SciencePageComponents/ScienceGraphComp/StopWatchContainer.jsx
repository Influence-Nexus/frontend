import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Button from "react-bootstrap/Button";
import { FaMedal, FaStopwatch } from "react-icons/fa";


export const StopWatchContainer = ({planetColor}) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef();

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);


    return (
        <div className="science-stopwatch-container">
            <div className="science-stopwatch-container-time">
                <h3>Time</h3>
                <p>
                    <FaStopwatch />
                    {`${String(Math.floor(elapsedTime / 60)).padStart(
                        2,
                        "0"
                    )}:${String(elapsedTime % 60).padStart(2, "0")}`}
                </p>
            </div>
            <div className="science-stopwatch-container-score">
                <h3>Score</h3>
                <p>
                    <FaMedal /> {`${score}`}
                </p>
            </div>
            <div className="science-stopwatch-container-table">
                <h3> Vertices</h3>
            </div>
            <div className="science-stopwatch-container-buttons" style={{ display: "flex" }}>
                <Button
                    style={{ backgroundColor: planetColor, color: "black", border: `1px solid ${planetColor}` }}
                    disabled={isRunning}
                    onClick={() => setIsRunning(true)}
                >
                    Start
                </Button>{" "}
                <Button
                    variant="danger"
                    disabled={!isRunning}
                    onClick={() => setIsRunning(false)}
                >
                    Stop
                </Button>
            </div>
        </div>
    )
}