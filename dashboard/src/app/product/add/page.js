"use client";
import { useState } from 'react';

const AddProduct = () => {
 // State to hold the form data
 const [product, setProduct] = useState({
    name: '',
    code: '',
    price: '',
    desc: '',
    group_id: '',
    quantity: '',
    flag: '',
 });

 // Handler for input changes
 const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
 };

 // Handler for form submission
 const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming you have a function to handle the API call
    // You would replace this with your actual API call logic
    try {
      const response = await fetch('http://localhost:8080/product/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      // Handle success (e.g., show a success message, redirect)
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      // Handle error (e.g., show an error message)
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
      <button type="submit">Add Product</button>
    </form>
 );
};

export default AddProduct;
