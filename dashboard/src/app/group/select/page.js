"use client";

import SelectIdComponent from "@/components/selectIdComponent";

const SelectGroup = ({ onClickFunction }) => {
  return (
    <SelectIdComponent
      onClickFunction={onClickFunction}
      children={"Select group"}
      dataType={"group"}
    ></SelectIdComponent>
  );
};

export default SelectGroup;
