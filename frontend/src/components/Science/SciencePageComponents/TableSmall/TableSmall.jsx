import React, { useState } from 'react';
import './TableSmall.css';

const TableHeader = [
    { title: 'ID', width: '45px' },
    { title: 'Response', width: '120px' },
    { title: 'Impact', width: '120px' },
    { title: 'Eff_in', width: '120px' },
    { title: 'Control_in', width: '120px' },
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

    return (
      <div className="small-table-container">
        <table>
          <thead>
            <tr>
              {TableHeader.map((header, index) => (
                <th key={index} style={{ width: header.width }}>
                  {header.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {TableHeader.map((header, columnIndex) => (
                  <td key={columnIndex} style={{ width: header.width }}>
                    {row[header.title]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };