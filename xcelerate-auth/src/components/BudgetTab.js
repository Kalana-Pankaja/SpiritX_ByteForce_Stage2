import React from "react";

const BudgetTab = ({ budget }) => {
  return (
    <div className="budget-tab">
      <h2>Budget</h2>
      <p>Remaining Budget: Rs. {budget}</p>
    </div>
  );
};

export default BudgetTab;