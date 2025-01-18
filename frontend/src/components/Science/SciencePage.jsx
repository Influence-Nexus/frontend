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

  useEffect(() => {
    const fetchSyntheticData = async () => {
      try {
        const response = await fetch("http://localhost:5000/synthetic_data"); // Замените URL на ваш эндпоинт
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const dataFromBackend = await response.json();
        setSyntheticData(dataFromBackend); // Сохраняем данные в состояние
      } catch (error) {
        console.error("Ошибка при получении синтетических данных:", error);
      }
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

  // Запрос для получения данных матрицы
  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/science_table?matrixName=Crime & Punishment 28_12_2023`);
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const dataFromBackend = await response.json();
        setMatrixInfo(dataFromBackend); // Сохраняем данные о матрице

        // Преобразуем данные в формат для маленькой таблицы
        const tableData = dataFromBackend.u.map((value, index) => ({
          ID: index + 1,
          Response: dataFromBackend.u[index].toFixed(4), // Пример преобразования значения
          Impact: dataFromBackend.x[index].toFixed(4),
          Eff_in: dataFromBackend.normalized_u[index].toFixed(4),
          Control_in: dataFromBackend.normalized_x[index].toFixed(4),
        }));
        setSmallTableData(tableData); // Обновляем данные для таблицы
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchMatrixData();
  }, [matrix_id]);

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
