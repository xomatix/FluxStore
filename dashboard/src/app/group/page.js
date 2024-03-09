"use client";
import SearchBox from "@/components/searchBox";
import { GroupController } from "@/controllers/groupController";
import { calculateSHA256 } from "@/logic/hashing";
import { useEffect, useState } from "react";

const GroupList = () => {
  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      var inputModel = { group: true };
      var hash = calculateSHA256(JSON.stringify(inputModel));
      var cachedData = JSON.parse(localStorage.getItem(hash))?.data;
      if (cachedData != undefined) {
        setGroupList(cachedData);
      }

      var data = await GroupController.list(inputModel);
      data = data.data;

      if (data != undefined) {
        setGroupList(data);
      }
    }
    fetchData();
  }, []);

  const handleGroupRedirect = (e, id) => {
    e.preventDefault();
    if (id == 0) return;
    window.location.href = `/group/${id}`;
  };

  return (
    <>
      <div className="center">
        <h3>
          Group List
          <br />
          <div
            className={"btn-primary"}
            onClick={(e) => handleGroupRedirect(e, "add")}
          >
            Add +
          </div>
        </h3>
      </div>
      <SearchBox></SearchBox>
      <table className="container">
        {groupList.map((x, i) => {
          return (
            <tr
              className={"search-item"}
              onClick={(e) => handleGroupRedirect(e, x.id)}
            >
              <td>{x.id}</td>
              <td>{x.name}</td>
              <td>{x.code}</td>
              <td>
                <button className={"btn-secondary "}>🔎</button>
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

export default GroupList;
