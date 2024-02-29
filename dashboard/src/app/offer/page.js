"use client";
import { GroupController } from "@/controllers/groupController";
import { OfferController } from "@/controllers/offerController";
import { ProductValueController } from "@/controllers/productValueController";
import { ProductValueModelController } from "@/controllers/productValueModelController";
import { ProductController } from "@/controllers/productcontroller";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const GroupList = () => {
  const [groupList, setGroupList] = useState([]);
  const params = useParams();
  useEffect(() => {
    async function fetchData() {
      var data = await OfferController.list();
      data = data.data;

      setGroupList(data);
    }
    fetchData();
  }, []);

  const handleGroupRedirect = (e, id) => {
    e.preventDefault();
    if (id == 0) return;
    window.location.href = `/offer/${id}`;
  };

  return (
    <>
      <h3>Offer List</h3>
      <div className="centered-list">
        <div class="divTable">
          {groupList.map((x, i) => {
            return (
              <div
                className={"row"}
                onClick={(e) => handleGroupRedirect(e, x.id)}
              >
                <div className={"cell"}>{x.id}</div>
                <div className={"cell"}>{x.name}</div>
                <div className={"cell"}>{x.disc_price}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GroupList;
