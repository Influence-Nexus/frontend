import React, { useState } from "react";
import "./TableSmall.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TableHeader = [
  { title: "ID", key: "ID", width: "75px", height: "75px" },
  {
    title: "Реакция (отклик) узлов модели на воздействие",
    key: "Response",
    width: "170px",
    height: "75px",
  },
  {
    title: "Сила воздействия от узла",
    key: "Impact",
    width: "200px",
    height: "75px",
  },
  {
    title: "Взвешенная реакция узла",
    key: "Eff_in",
    width: "120px",
    height: "75px",
  },
  {
    title: "Взвешенное воздействие от узла",
    key: "Control_in",
    width: "120px",
    height: "75px",
  },
];

const generateRandomData = () => {
  const data = [];
  for (let i = 0; i < 6; i++) {
    data.push({
      ID: Math.floor(Math.random() * 100),
      Response: Math.floor(Math.random() * 10),
      Impact: Math.floor(Math.random() * 50),
      Eff_in: Math.floor(Math.random() * 20),
      Control_in: Math.floor(Math.random() * 30),
    });
  }
  return data;
};

export const TableSmall = () => {
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
    <div id="small-table-alignment-div">

      <h5 style={{ color: "#ffd700", height: '48px' }}>Step 1: Находим силу воздействия каждого узла по алгоритму из [Science]</h5>

      <h2 id="small-table-name">
        Отклики и воздействия, рассчитанные алгоритмом [
        <a href="https://arxiv.org">1</a>]
      </h2>

      <div className="small-table-container">
        <table>
          <thead>
            <tr>
              {TableHeader.map((header, index) => (
                <th
                  key={index}
                  style={{
                    width: header.width,
                    height: header.height,
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
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowUpIcon />
                    ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                {TableHeader.map((header, columnIndex) => (
                  <td
                    key={columnIndex}
                    style={{
                      width: header.width,
                      fontSize: "18px"
                    }}
                  >
                    {row[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
