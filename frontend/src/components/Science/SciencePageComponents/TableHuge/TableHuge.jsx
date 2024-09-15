import React, { useState } from "react";
import "./TableHuge.css";

const TableHeader1 = [
  { title: "Cognition", width: "264px", colSpan: 2 },
  { title: "Player", width: "264px", colSpan: 2 },
];

const TableHeader2 = [
  { title: "ID", width: "45px" },
  { title: "Score", width: "161px" },
  { title: "S", width: "161px" },
  { title: "Score", width: "161px" },
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
              <th key={index} style={{ width: header.width }}>
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Строки с данными */}
          {data.map((row, index) => (
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
