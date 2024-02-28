"use client";
import SelectGroup from "@/app/group/select/page";
import { GroupController } from "@/controllers/groupController";
import { ProductController } from "@/controllers/productcontroller";
import { useState } from "react";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    code: "",
    price: 0,
    desc: "",
    group_id: 0,
    quantity: 0,
    flag: 0,
  });

  const [groupData, setGroupData] = useState({
    id: 0,
    name: "",
    code: "",
    flag: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof product.group_id === "string") {
      product.group_id = parseInt(product.group_id, 10);
    }

    if (typeof product.price === "string") {
      product.price = parseFloat(product.price);
    }

    try {
      console.log(JSON.stringify(product));
      const response = await ProductController.add(product); // Directly pass the product object
      // Handle the result here, e.g., show a success message or update the product list
      console.log("Product added successfully:", response);
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle errors, e.g., show an error message to the user
    }
  };

  async function fetchGroupData(value) {
    var data = await GroupController.list({ ids: [value] });
    data = data.data[0];
    setGroupData({
      name: data.name,
      code: data.code,
      flag: data.flag,
      id: data.id,
    });
  }

  const handleGroupSelect = (value) => {
    setProduct({ ...product, group_id: value });
    console.log(product);
    fetchGroupData(value);
  };

  const handleGroupRedirect = (e) => {
    e.preventDefault();
    if (groupData.id == 0) return;
    window.open(`/group/${groupData.id}`, "_blank", "noopener,noreferrer");
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
        Group:
        <br />
        <SelectGroup onClickFunction={handleGroupSelect}></SelectGroup>
        <input
          className={"link-input"}
          onClick={(e) => handleGroupRedirect(e)}
          readOnly={true}
          type="text"
          name="group_name"
          value={groupData.code}
        />
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
      <button className={"button-green"} type="submit">
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
