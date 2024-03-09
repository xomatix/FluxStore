"use client";

import SelectProduct from "@/app/product/select/page";
import { OfferController } from "@/controllers/offerController";
import { ProductController } from "@/controllers/productcontroller";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const OfferAddUpdateForm = () => {
  const [formData, setFormData] = useState({
    id: 0,
    product_id: 0,
    discount: 0.0,
    disc_price: 0.0,
    flag: 0,
  });

  const [product, setProduct] = useState({
    name: "",
    code: "",
    price: 0,
    quantity: 0,
    flag: 0,
  });

  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      var data = await OfferController.list({ ids: [Number(params.offer_id)] });
      data = data.data[0];
      setFormData({
        ...formData,
        id: data.id,
        product_id: data.product_id,
        discount: data.discount,
        disc_price: data.disc_price,
        flag: data.flag,
      });
      setProduct({
        ...product,
        id: data.product_id,
        name: data.name,
        code: data.code,
        flag: data.product_flag,
        quantity: data.quantity,
        price: data.price,
      });
      //fetchProductData(data.product_id);
    }
    fetchData();
  }, []);

  async function fetchProductData(value) {
    var data = await ProductController.list({ ids: [value] });
    data = data.data[0];
    setProduct({
      name: data.name,
      code: data.code,
      price: data.price,
      quantity: data.quantity,
      price: data.price,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    params.offer_id = Number(params.offer_id);
    if (
      params.offer_id == null ||
      params.offer_id == undefined ||
      isNaN(params.offer_id)
    ) {
      var inputModel = { ...formData };
      var response = await OfferController.add(inputModel);
      response = response.data[0].id;

      window.location.href = "/offer/" + response;
    }

    if (
      typeof params.offer_id == typeof 0 &&
      params.offer_id != undefined &&
      !isNaN(params.offer_id)
    ) {
      var inputModel = { ...formData, discount: Number(formData.discount) };
      var response = await OfferController.update(inputModel);
      response = response.data[0].id;

      window.location.href = "/offer/" + response;
    }
    // console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (value) => {
    setFormData({ ...formData, product_id: value });
    fetchProductData(value);
  };

  const handleProductRedirect = (e) => {
    e.preventDefault();
    if (formData.product_id == 0) return;
    window.open(
      `/product/update/${formData.product_id}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="container">
      <label>
        <p>product:</p>
        <br />
        <SelectProduct onClickFunction={handleProductSelect} />
        <br />
      </label>
      <label>
        <p>name:</p>
        <input readOnly={true} type="text" name="name" value={product.name} />
      </label>
      <label>
        <p>code:</p>
        <input
          className={"link-input"}
          onClick={(e) => handleProductRedirect(e)}
          readOnly={true}
          type="text"
          name="code"
          value={product.code}
        />
      </label>
      <label>
        <p>base price:</p>
        <input readOnly={true} type="text" name="price" value={product.price} />
      </label>
      <label>
        <p>quantity:</p>
        <input
          readOnly={true}
          type="text"
          name="quantity"
          value={product.quantity}
        />
      </label>
      <label>
        <p>discount:</p>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
        />
      </label>
      <label>
        <p>Price after discount:</p>
        <input
          readOnly={true}
          type="number"
          name="disc_price"
          value={
            Math.round(
              100 * product.price * ((100 - formData.discount) / 100)
            ) / 100
          }
          onChange={handleChange}
        />
      </label>
      <div className="center">
        <button className={"btn-primary"} onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default OfferAddUpdateForm;
