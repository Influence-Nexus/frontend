import React from "react";
import "./Conditions.css";

export const Conditions = () => {
  return (
    <div className="Conditions-Restrictins-div">
      <div className="Conditions-div">
        <h1>Conditions:</h1>
        <h2>δ=0.02</h2>
      </div>
      <div className="Restrictions-div">
        <h1>Restrictions:</h1>
        <p>N(0): 1, 2, 3</p>
        <p>N(+): 1, 2, 3</p>
        <p>N(-): 1, 2, 3</p>
      </div>
    </div>
  );
};
