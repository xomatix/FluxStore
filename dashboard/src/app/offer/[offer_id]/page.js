"use client";
import SelectGroup from "@/app/group/select/page";
import SelectProduct from "@/app/product/select/page";
import SelectIdComponent from "@/components/selectIdComponent";
import { ProductController } from "@/controllers/productcontroller";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const OfferAddUpdateForm = () => {
  const [formData, setFormData] = useState({
    id: 0,
    product_id: 0,
    discount: 0.0,
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
      console.log("pop " + params.offer_id);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (value) => {
    setFormData({ ...formData, product_id: value });
    fetchProductData(value);
  };

  return (
    <div className="form">
      <label>
        Product:
        <br />
        <SelectProduct onClickFunction={handleProductSelect} />
        <br />
      </label>
      <label>
        name:
        <input readOnly={true} type="text" name="name" value={product.name} />
      </label>
      <label>
        code:
        <input readOnly={true} type="text" name="code" value={product.code} />
      </label>
      <label>
        base price:
        <input readOnly={true} type="text" name="price" value={product.price} />
      </label>
      <label>
        quantity:
        <input
          readOnly={true}
          type="text"
          name="quantity"
          value={product.quantity}
        />
      </label>
      <label>
        Discount:
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
        />
      </label>
      <button className={"button-green"} onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
};

export default OfferAddUpdateForm;
