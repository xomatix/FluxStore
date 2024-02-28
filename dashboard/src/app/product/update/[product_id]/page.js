"use client";
import { ProductController } from '@/controllers/productcontroller';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductAddUpdateForm = () => {
  const [product, setFormData] = useState({
    name: '',
    code: '',
    price: 0,
    desc: '',
    group_id: 0,
    quantity: 0,
    flag: 0,
  });

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
console.log(data);
      setFormData({
        id: data.id,
        name: data.name,
        code: data.code,
        price: data.price,
        quantity: data.quantity,
        desc: data.desc,
        group_id: data.group_id,
        flag: data.flag,
      });
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...product, [e.target.name]: e.target.value });
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
  
      window.location.href = "/product/update/" + response;
    }
    console.log(product);
  };
  

  
return (
  <form onSubmit={handleSubmit}>
    <label>
      Name:
      <input type="text" name="name" value={product.name} onChange={handleChange} />
    </label>
    <label>
      Code:
      <input readOnly={true} type="text" name="code" value={product.code} onChange={handleChange} />
    </label>
    <label>
      Price:
      <input type="text" name="price" value={product.price} onChange={handleChange} />
    </label>
    <label>
      Description:
      <textarea name="desc" value={product.desc} onChange={handleChange} />
    </label>
    <label>
      Quantity:
      <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
    </label>
    <label>
      Flag:
      <input type="number" name="flag" value={product.flag} onChange={handleChange} />
    </label>
    <button type="submit">update product</button>
  </form>
);
};

export default ProductAddUpdateForm;
