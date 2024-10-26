import React from "react";
import { SciencePageButtons } from "../SciencePageComponents/Buttons/SciencePageButtons";
import { TableSmall } from "../SciencePageComponents/TableSmall/TableSmall";
import "./SciencePage.css";
import { TableHuge } from "../SciencePageComponents/TableHuge/TableHuge";
import { Conditions } from "../SciencePageComponents/Conditions/Conditions";

export const SciencePage = () => {
  return (
    <div>
      <SciencePageButtons />
      <h1 style={{ textAlign: "center", marginTop: "1.5em", color: "#ffd700"}} id="sp-h1">
        Model: name
      </h1>
      <Conditions />
      <div className="Tables-Comp-Div">
        
        <TableSmall />
        <TableHuge />
      </div>
      <h5 style={{color: "#ffd700", marginLeft: "6em"}}>Step 3: Сыграем с нашими данными</h5>
    </div>
  );
};
