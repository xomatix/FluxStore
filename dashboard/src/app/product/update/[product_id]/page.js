"use client";
import { GroupController } from "@/controllers/groupController";
import { ProductValueController } from "@/controllers/productValueController";
import { ProductValueModelController } from "@/controllers/productValueModelController";
import { ProductController } from "@/controllers/productcontroller";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductUpdate = () => {
  const [product, setProductData] = useState({
    name: "",
    code: "",
    price: 0,
    desc: "",
    group_id: 0,
    quantity: 0,
    flag: 0,
  });
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    code: "",
    flag: 0,
  });
  const [valueModelData, setValueModelData] = useState([]);
  const params = useParams();
  useEffect(() => {
    if (
      params.product_id == null ||
      params.product_id == undefined ||
      isNaN(params.product_id)
    )
      return;
    async function fetchData() {
      const inputModel = {
        ids: [params.product_id],
      };
      var data = await ProductController.list(inputModel);
      data = data.data[0];
      if (data == null || data == undefined) return;
      var product_id = data.id;
      setProductData({
        id: data.id,
        name: data.name,
        code: data.code,
        price: data.price,
        quantity: data.quantity,
        desc: data.desc,
        group_id: data.group_id,
        flag: data.flag,
      });

      const groupInputModel = {
        ids: [data.group_id],
      };
      var groupData = await GroupController.list(groupInputModel);
      groupData = groupData.data[0];
      if (groupData == null || groupData == undefined) return;

      setFormData({
        ...formData,
        id: groupData.id,
        name: groupData.name,
        code: groupData.code,
      });

      const vmInputModel = {
        data: {
          group_id: Number(groupData.id),
        },
      };
      var vmData = await ProductValueModelController.list(vmInputModel);
      vmData = vmData.data;

      var filledValues = data.valuelist;
      for (let index = 0; index < filledValues.length; index++) {
        if (filledValues[index].model_id == null) {
          filledValues.splice(index, 1);
        }
      }

      vmData.forEach((valueModelElement) => {
        var isFilled = false;
        filledValues.forEach((valueElement) => {
          valueElement.product_id = product_id;
          if (valueModelElement.id == valueElement.model_id) {
            isFilled = true;
          }
        });
        if (isFilled == false) {
          var valueModel = {
            ...valueModelElement,
            model_id: valueModelElement.id,
            product_id: product_id,
            value: "",
          };
          filledValues.push(valueModel);
        }
      });

      setValueModelData(filledValues);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setProductData({ ...product, [e.target.name]: e.target.value });
  };

  const handleChangeValueModel = (e, i) => {
    e.preventDefault();
    const newValueModelData = [...valueModelData];
    newValueModelData[i][e.target.name] = e.target.value;
    setValueModelData(newValueModelData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    params.product_id = Number(params.product_id);
    if (
      typeof params.product_id == typeof 0 &&
      params.product_id != undefined &&
      !isNaN(params.product_id)
    ) {
      var inputModel = product;
      inputModel.group_id = null;
      var response = await ProductController.update(inputModel);
      response = response.data[0].id;

      valueModelData.forEach(async (element) => {
        var vmInputModel = {
          ...element,
        };
        // console.log(vmInputModel);
        await ProductValueController.add(vmInputModel);
      });

      window.location.href = "/product/update/" + response;
    }
    console.log(product);
  };

  const handleGroupRedirect = (e) => {
    e.preventDefault();
    if (formData.id == 0) return;
    window.open(`/group/${formData.id}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Code:
        <input
          readOnly={true}
          type="text"
          name="code"
          value={product.code}
          onChange={handleChange}
        />
      </label>
      <label>
        Price:
        <input
          type="text"
          name="price"
          value={product.price}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <textarea name="desc" value={product.desc} onChange={handleChange} />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
        />
      </label>
      <label>
        Flag:
        <input
          type="number"
          name="flag"
          value={product.flag}
          onChange={handleChange}
        />
      </label>
      <label>
        Group:
        <input
          className={"link-input"}
          readOnly={true}
          type="text"
          name="code"
          value={`${formData.name} - ${formData.code}`}
          onClick={handleGroupRedirect}
        />
      </label>

      <h3>
        <b>Product Values</b>
      </h3>
      <div className="cards-container">
        {valueModelData.map((x, i) => (
          <div key={i} className="card">
            <label>
              {x.name}:
              <input
                type="text"
                name="value"
                value={x.value}
                onChange={(e) => handleChangeValueModel(e, i)}
              />
            </label>
          </div>
        ))}
      </div>

      <button className="button-green" type="submit">
        Update Product
      </button>
    </form>
  );
};

export default ProductUpdate;
