// components/HistoryTable.jsx
import React, { useEffect, useState } from "react";
import { getGameHistory } from "../../clientServerHub";

export const HistoryTable = ({ matrixUuid, planetColor }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getGameHistory(matrixUuid);
        setHistory(res.history || []);
      } catch (e) {
        console.error("History load error:", e);
      }
    })();
  }, [matrixUuid]);

  if (!history.length) return <p style={{color:"white"}}>Нет сыгранных партий</p>;

  return (
    <div style={{maxHeight:600,overflowY:"auto"}}>
      <table style={{borderCollapse:"collapse",minWidth:400}}>
        <thead>
          <tr>
            <th style={{border:"1px solid white",padding:8}}>Дата</th>
            <th style={{border:"1px solid white",padding:8}}>Ходов</th>
            <th style={{border:"1px solid white",padding:8}}>Счёт</th>
          </tr>
        </thead>
        <tbody>
          {history.map((g,i)=>(
            <tr key={i}>
              <td style={{border:"1px solid white",padding:8}}>
                {new Date(g.timestamp).toLocaleString()}
              </td>
              <td style={{border:"1px solid white",padding:8,textAlign:"center"}}>
                {g.turns?.length ?? 0}
              </td>
              <td style={{border:"1px solid white",padding:8,fontWeight:"bold",color:planetColor}}>
                {g.final_score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
