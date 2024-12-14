// SciencePage.jsx
import React, { useEffect, useState } from "react";
import { SciencePageButtons } from "./SciencePageComponents/Buttons/SciencePageButtons";
import { TableSmall } from "./SciencePageComponents/TableSmall/TableSmall";
import { TableHuge } from "./SciencePageComponents/TableHuge/TableHuge";
import { Conditions } from "./SciencePageComponents/Conditions/Conditions";
import { useLocation } from "react-router-dom";
import { ScienceGraphComp } from "./SciencePageComponents/ScienceGraphComp/ScienceGraphComp";
import "./SciencePage.css";
import { cards } from "../SoralSystem/cards";
import { SyntheticTable } from "./SciencePageComponents/ScienceGraphComp/Table";
import { StopWatchContainer } from "./SciencePageComponents/ScienceGraphComp/StopWatchContainer";

export const SciencePage = () => {
  const location = useLocation();
  const { selectedPlanet, selectedCardIndex } = location.state || {};

  const matrix_id = selectedCardIndex + 1; // или другая логика получения matrix_id
  const [matrixInfo, setMatrixInfo] = useState(null);

  // State for table data
  const [syntheticData, setSyntheticData] = useState(null);
  const [hugeTableData, setHugeTableData] = useState(null);
  const [smallTableData, setSmallTableData] = useState(null);

  useEffect(() => {
    if (matrix_id) {
      fetch(`http://localhost:5000/matrix/${matrix_id}`)
        .then((response) => response.json())
        .then((data) => setMatrixInfo(data))
        .catch((error) =>
          console.error("Ошибка при получении матрицы:", error)
        );
    }
  }, [matrix_id]);

  // Simulate fetching synthetic data
  useEffect(() => {
    // Replace this with actual fetch when backend is ready
    const fetchSyntheticData = () => {
      // Simulating a network request with setTimeout
      setTimeout(() => {
        // If backend is ready, replace the below with actual fetch
        const dataFromBackend = null; // Replace with fetched data
        setSyntheticData(dataFromBackend);
      }, 1000);
    };

    fetchSyntheticData();
  }, []);

  // Similarly, simulate fetching for other tables
  useEffect(() => {
    const fetchHugeTableData = () => {
      setTimeout(() => {
        const dataFromBackend = null; // Replace with fetched data
        setHugeTableData(dataFromBackend);
      }, 1000);
    };

    fetchHugeTableData();
  }, []);

  useEffect(() => {
    const fetchSmallTableData = () => {
      setTimeout(() => {
        const dataFromBackend = null; // Replace with fetched data
        setSmallTableData(dataFromBackend);
      }, 1000);
    };

    fetchSmallTableData();
  }, []);

  return (
    <div>
      <SciencePageButtons />
      {selectedPlanet && selectedCardIndex !== undefined && (
        <h1
          style={{ textAlign: "center", marginTop: "1.5em", color: "#ffd700" }}
          id="sp-h1"
        >
          Model: {cards[selectedPlanet.name][selectedCardIndex].title}
        </h1>
      )}
      <Conditions />
      <div className="Tables-Comp-Div">
        <TableSmall data={smallTableData} />
        <TableHuge data={hugeTableData} />
      </div>
      <h5 style={{ color: "#ffd700", marginLeft: "6em" }}>
        Step 3: Сыграем с нашими данными
      </h5>

      {matrixInfo && matrixInfo.edges && (
        <div style={{ marginTop: "2em", display: "flex" }}>
          <ScienceGraphComp matrixInfo={matrixInfo} />
          <StopWatchContainer />
          <SyntheticTable data={syntheticData} />
        </div>
      )}
    </div>
  );
};
