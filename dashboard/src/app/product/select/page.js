"use client";

import SelectIdComponent from "@/components/selectIdComponent";

const SelectProduct = ({ onClickFunction }) => {
  return (
    <SelectIdComponent
      onClickFunction={onClickFunction}
      children={"Select product"}
      dataType={"product"}
    ></SelectIdComponent>
  );
};

export default SelectProduct;
