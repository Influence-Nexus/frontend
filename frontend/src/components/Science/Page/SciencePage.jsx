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
      <h1 style={{ textAlign: "center" }} id="sp-h1">
        Model: name
      </h1>
      <Conditions />
      <div className="Tables-Comp-Div">
        
        <TableSmall />
        <TableHuge />
      </div>
    </div>
  );
};
