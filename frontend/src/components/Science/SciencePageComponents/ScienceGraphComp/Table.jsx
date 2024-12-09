// SyntheticTable.jsx
import React from "react";
import "./ScienceGraphComp.css"; // Assuming you have a CSS file
// Remove the generateSyntheticData and useState as data is now passed via props

const SyntheticTableHeader = [
  { title: "Параметр", key: "Parameter", width: "200px" },
  { title: "Значение", key: "Value", width: "200px" },
];

export const SyntheticTable = ({ data }) => {
  // Define default data when backend data is not available
  const defaultData = [
    { Parameter: "Скорость узла", Value: "None" },
    { Parameter: "Мощность узла", Value: "None" },
    { Parameter: "Энергия системы", Value: "None" },
    { Parameter: "Средний отклик", Value: "None" },
    { Parameter: "Время задержки", Value: "None" },
  ];

  const tableData = data || defaultData;

  return (
    <div
      id="synthetic-table-container"
      style={{ flex: "1", marginLeft: "20px" }}
    >
      <h5 style={{ color: "#ffd700", textAlign: "center" }}>
        Синтетические данные для анализа
      </h5>
      <table>
        <thead>
          <tr>
            {SyntheticTableHeader.map((header, index) => (
              <th
                key={index}
                style={{
                  width: header.width,
                  fontSize: "18px",
                  textAlign: "left",
                }}
              >
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td style={{ width: SyntheticTableHeader[0].width }}>
                {row.Parameter}
              </td>
              <td style={{ width: SyntheticTableHeader[1].width }}>
                {row.Value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
