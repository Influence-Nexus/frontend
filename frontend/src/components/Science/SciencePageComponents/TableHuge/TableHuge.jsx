import React, { useState } from "react";
import "./TableHuge.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TableHeader1 = [
  { title: "Cognition", width: "240px", colSpan: 2 },
  { title: "Player", width: "240px", colSpan: 2 },
];

const TableHeader2 = [
  { title: "ID", key: "ID", width: "60px" },
  { title: "Score", key: "Score1", width: "160px" },
  { title: "S", key: "S", width: "60px" },
  { title: "Score", key: "Score2", width: "160px" },
];

const generateRandomData = () => {
  const data = [];
  for (let i = 0; i < 5; i++) {
    // 5 строк с данными, а не 6
    data.push({
      ID: Math.floor(Math.random() * 100),
      Score1: Math.floor(Math.random() * 10),
      S: Math.floor(Math.random() * 50),
      Score2: Math.floor(Math.random() * 20),
    });
  }
  return data;
};

export const TableHuge = () => {
  const [data, setData] = useState(generateRandomData());

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [hoveredSortButton, setHoveredSortButton] = useState(null);

  const onSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="table-container">
      <table>
        <thead>
          {/* Первая строка заголовков */}
          <tr>
            {TableHeader1.map((header, index) => (
              <th
                key={index}
                colSpan={header.colSpan}
                style={{ width: header.width }}
              >
                {header.title}
              </th>
            ))}
          </tr>
          {/* Вторая строка заголовков */}
          <tr>
            {TableHeader2.map((header, index) => (
              <th
                key={index}
                style={{
                  width: header.width,
                  position: "relative",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredSortButton(index)}
                onMouseLeave={() => setHoveredSortButton(null)}
                onClick={() => onSort(header.key)}
              >
                {header.title}
                {(hoveredSortButton === index ||
                  sortConfig.key === header.key) &&
                  (sortConfig.key === header.key &&
                  sortConfig.direction === "ascending" ? (
                    <KeyboardArrowDownIcon style={{ marginLeft: "5px" }} />
                  ) : (
                    <KeyboardArrowUpIcon style={{ marginLeft: "5px" }} />
                  ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Строки с данными */}
          {sortedData.map((row, index) => (
            <tr key={index}>
              <td>{row.ID}</td>
              <td>{row.Score1}</td>
              <td>{row.S}</td>
              <td>{row.Score2}</td>
            </tr>
          ))}
          {/* Последняя строка с символом суммы */}
          <tr>
            <td>Σ</td>
            <td>{data.reduce((sum, row) => sum + row.Score1, 0)}</td>
            <td>{data.reduce((sum, row) => sum + row.S, 0)}</td>
            <td>{data.reduce((sum, row) => sum + row.Score2, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
