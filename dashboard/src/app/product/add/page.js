"use client";
import { useState } from 'react';

const AddProduct = () => {
 const [product, setProduct] = useState({
    name: '',
    code: '',
    price: '',
    desc: '',
    group_id: '',
    quantity: '',
    flag: '',
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
 };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(product);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch('http://localhost:8080/product/add', requestOptions);
      const result = await response.text();
      console.log(result);
      // Handle success (e.g., redirect to product list, show success message)
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
 };

 return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={product.name} onChange={handleChange} />
      </label>
      <label>
        Code:
        <input type="text" name="code" value={product.code} onChange={handleChange} />
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
        Group ID:
        <input type="number" name="group_id" value={product.group_id} onChange={handleChange} />
      </label>
      <label>
        Quantity:
        <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
      </label>
      <label>
        Flag:
        <input type="number" name="flag" value={product.flag} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
    </form>
 );
};

export default AddProduct;
