"use client";
import SearchBox from "@/components/searchBox";
import { ProductController } from "@/controllers/productcontroller";
import { calculateSHA256 } from "@/logic/hashing";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const GroupList = () => {
  const [groupList, setGroupList] = useState([]);
  const params = useParams();
  useEffect(() => {
    async function fetchData() {
      var inputModel = { product: true };
      var hash = calculateSHA256(JSON.stringify(inputModel));
      var cachedData = JSON.parse(localStorage.getItem(hash))?.data;
      if (cachedData != undefined) {
        setGroupList(cachedData);
      }

      var data = await ProductController.list(inputModel);
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
    window.location.href = `/product/${id}`;
  };

  return (
    <>
      <div className={"center"}>
        <h3>
          Product List <br />
          <button
            className={"btn-primary"}
            onClick={(e) => handleGroupRedirect(e, "add")}
          >
            Add +
          </button>
        </h3>
      </div>
      <SearchBox></SearchBox>
      <table className="container">
        {groupList.map((x, i) => {
          return (
            <tr
              className={"search-item"}
              onClick={(e) => handleGroupRedirect(e, "update/" + x.id)}
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
