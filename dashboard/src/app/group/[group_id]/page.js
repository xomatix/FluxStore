"use client";
import { GroupController } from "@/controllers/groupController";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const GroupAddUpdateForm = () => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    flag: 0,
  });

  const params = useParams();
  useEffect(async () => {
    console.log("start of loading data " + params.group_id);

    const inputModel = {
      ids: [params.group_id],
    };
    var data = await GroupController.list(inputModel).data[0];

    if (data == null || data == undefined) return;

    setFormData({ ...formData, id: data.id, name: data.name });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Group name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <input type="submit" value="Save" />
    </form>
  );
};

export default GroupAddUpdateForm;
