"use client";
import { GroupController } from "@/controllers/groupController";
import productValueModelController, {
  ProductValueModelController,
} from "@/controllers/productValueModelController";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    desc: "",
    flag: 0,
  });

  const params = useParams();
  useEffect(() => {
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

      setValueModelDataForm({
        ...valueModelDataForm,
        group_id: data.id,
      });

      const vmInputModel = {
        data: {
          group_id: Number(params.group_id),
        },
      };
      console.log(vmInputModel);
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

  const handleChangeValueModelForm = (e) => {
    setValueModelDataForm({
      ...valueModelDataForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = (e, i) => {
    if (confirm("Are you sure u want to delete this value model?")) {
      var inputModel = { id: valueModelData[i].id };
      ProductValueModelController.delete(inputModel);
      window.location.href = window.location.href;
    }
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

      if (valueModelDataForm.name != "" && valueModelDataForm.code != "") {
        await ProductValueModelController.add(valueModelDataForm);
      }
      window.location.href = "/group/" + response;
    }
    // console.log(formData);
    // console.log(valueModelData);
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
            typeof Number(valueModelDataForm.group_id) == typeof 0 &&
            Number(valueModelDataForm.group_id) != undefined &&
            !isNaN(Number(valueModelDataForm.group_id))
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
          <div className="cards-container">
            {valueModelData.map((x, i) => {
              return (
                <div className="card">
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
                    <textarea
                      type="text"
                      name="desc"
                      value={valueModelData[i].desc}
                      onChange={(e) => handleChangeValueModel(e, i)}
                    />
                  </label>
                  <button
                    className="button-red"
                    onClick={(e) => handleDelete(e, i)}
                  >
                    Delete 🗑️
                  </button>
                  <hr />
                </div>
              );
            })}
          </div>
        </>
      )}
      {typeof Number(valueModelDataForm.group_id) == typeof 0 &&
        Number(valueModelDataForm.group_id) != undefined &&
        !isNaN(Number(valueModelDataForm.group_id)) && (
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
                onChange={handleChangeValueModelForm}
              />
            </label>
            <label>
              code:
              <input
                type="text"
                name="code"
                value={valueModelDataForm.code}
                onChange={handleChangeValueModelForm}
              />
            </label>
            <label>
              desc:
              <textarea
                type="text"
                name="desc"
                value={valueModelDataForm.desc}
                onChange={handleChangeValueModelForm}
              />
            </label>
          </>
        )}

      <input type="submit" value="Save" />
    </form>
  );
};

export default GroupAddUpdateForm;
