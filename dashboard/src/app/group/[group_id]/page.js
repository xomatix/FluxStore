"use client";
import { GroupController } from "@/controllers/groupController";
import productValueModelController, {
  ProductValueModelController,
} from "@/controllers/productValueModelController";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const GroupAddUpdateForm = () => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    code: "",
    flag: 0,
  });
  const [valueModelData, setValueModelData] = useState([]);
  const [valueModelDataForm, setValueModelDataForm] = useState({
    name: "",
    code: "",
    flag: 0,
  });

  const params = useParams();
  useEffect(() => {
    //console.log("start of loading data " + params.group_id);
    if (
      params.group_id == null ||
      params.group_id == undefined ||
      isNaN(params.group_id)
    )
      return;
    async function fetchData() {
      const inputModel = {
        ids: [params.group_id],
      };
      var data = await GroupController.list(inputModel);
      data = data.data[0];
      //   console.log("Data that i got: " + data.id + JSON.stringify(data));
      if (data == null || data == undefined) return;

      setFormData({
        ...formData,
        id: data.id,
        name: data.name,
        code: data.code,
      });

      const vmInputModel = {
        data: {
          group_id: params.group_id,
        },
      };
      var vmData = await ProductValueModelController.list(vmInputModel);
      vmData = vmData.data;
      //   console.log("Data that i got: " + vmData.id + JSON.stringify(vmData));
      if (vmData == null || vmData == undefined) return;
      setValueModelData(vmData);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeValueModel = (e, i) => {
    e.preventDefault();
    var oldData = valueModelData;
    oldData[i][e.target.name] = e.target.value;
    setValueModelData([...oldData]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    params.group_id = Number(params.group_id);
    if (
      params.group_id == null ||
      params.group_id == undefined ||
      isNaN(params.group_id)
    ) {
      var inputModel = formData;
      var response = await GroupController.add(inputModel);
      response = response.data[0].id;

      window.location.href = "/group/" + response;
    }

    if (
      typeof params.group_id == typeof 0 &&
      params.group_id != undefined &&
      !isNaN(params.group_id)
    ) {
      var inputModel = formData;
      var response = await GroupController.update(inputModel);
      response = response.data[0].id;

      valueModelData.forEach(async (element) => {
        var vmInputModel = {
          id: element.id,
          name: element.name,
          code: element.code,
          desc: element.desc,
          flag: element.flag,
        };
        console.log(vmInputModel);
        await ProductValueModelController.update(vmInputModel);
      });

      window.location.href = "/group/" + response;
    }
    console.log(formData);
    console.log(valueModelData);
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
      <label>
        Code:
        <input
          readOnly={
            typeof params.group_id == typeof 0 &&
            params.group_id != undefined &&
            !isNaN(params.group_id)
          }
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
        />
      </label>

      {valueModelData.length > 0 && (
        <>
          <h3>
            <b>Product Value Model</b>
          </h3>
          {valueModelData.map((x, i) => {
            return (
              <>
                <label>
                  name:
                  <input
                    type="text"
                    name="name"
                    value={valueModelData[i].name}
                    onChange={(e) => handleChangeValueModel(e, i)}
                  />
                </label>
                <label>
                  code:
                  <input
                    readOnly={true}
                    type="text"
                    name="code"
                    value={valueModelData[i].code}
                    onChange={(e) => handleChangeValueModel(e, i)}
                  />
                </label>
                <label>
                  desc:
                  <input
                    type="text"
                    name="desc"
                    value={valueModelData[i].desc}
                    onChange={(e) => handleChangeValueModel(e, i)}
                  />
                </label>
              </>
            );
          })}
        </>
      )}
      {typeof Number(params.group_id) == typeof 0 &&
        Number(params.group_id) != undefined &&
        !isNaN(Number(params.group_id)) && (
          <>
            <h3>
              <b>Add Product Value Model</b>
            </h3>
            <label>
              name:
              <input
                type="text"
                name="name"
                value={valueModelDataForm.name}
                onChange={handleChangeValueModel}
              />
            </label>
            <label>
              code:
              <input
                type="text"
                name="code"
                value={valueModelDataForm.code}
                onChange={handleChange}
              />
            </label>
          </>
        )}

      <input type="submit" value="Save" />
    </form>
  );
};

export default GroupAddUpdateForm;