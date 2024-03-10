import { GroupController } from "@/controllers/groupController";
import { ProductController } from "@/controllers/productcontroller";
import React, { useState, useEffect } from "react";
import SearchBox from "./searchBox";

const SelectIdComponent = ({ onClickFunction, children, dataType }) => {
  const [showContent, setShowContent] = useState(false);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      var data = { data: [] };
      if (dataType == "product") {
        var inputModel = { product: true };
        data = await ProductController.list(inputModel);
        data = data.data;
        setListData(data);
      }
      if (dataType == "group") {
        var inputModel = { group: true };
        data = await GroupController.list(inputModel);
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
      <button className="btn-primary" onClick={handleClick}>
        {children}
      </button>
      {showContent && (
        <div className="overlay-parent">
          <button
            className={"btn-primary"}
            onClick={(e) => {
              e.preventDefault();
              setShowContent(false);
            }}
          >
            Close
          </button>
          <SearchBox />
          <table className="container">
            {listData.map((x, i) => {
              return (
                <tr
                  key={i}
                  onClick={(e) => handleSelect(e, x.id)}
                  className={"search-item"}
                >
                  <td>{x.id}</td>
                  <td>{x.name}</td>
                  <td>{x.code}</td>
                  <td>
                    <button className={"btn-secondary "}>🗝️</button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      )}
    </>
  );
};

export default SelectIdComponent;
