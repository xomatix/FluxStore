import { GroupController } from "@/controllers/groupController";
import { ProductController } from "@/controllers/productcontroller";
import React, { useState, useEffect } from "react";

const SelectIdComponent = ({ onClickFunction, children, dataType }) => {
  const [showContent, setShowContent] = useState(false);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      var data = { data: [] };
      if (dataType == "product") {
        data = await ProductController.list();
        data = data.data;
        setListData(data);
      }
      if (dataType == "group") {
        data = await GroupController.list();
        data = data.data;
        setListData(data);
      }

      console.log(data);
    }
    fetchData();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    setShowContent(true);
  };

  const handleSelect = (e, id) => {
    e.preventDefault();
    onClickFunction(id);
    setShowContent(false);
  };

  return (
    <>
      <button className="button-blue" onClick={handleClick}>
        {children}
      </button>
      {showContent && (
        <div className="overlay-parent">
          <button
            className={"button-blue"}
            onClick={(e) => {
              e.preventDefault();
              setShowContent(false);
            }}
          >
            Close
          </button>
          <div className="centered-list">
            <div class="divTable">
              {listData.map((x, i) => {
                return (
                  <div className={"row"} onClick={(e) => handleSelect(e, x.id)}>
                    <div className={"cell"}>{x.id}</div>
                    <div className={"cell"}>{x.name}</div>
                    <div className={"cell"}>{x.code}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectIdComponent;
