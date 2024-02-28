"use client";
import { ProductController } from '@/controllers/productcontroller';
import { useState } from 'react';

const AddProduct = () => {
 const [product, setProduct] = useState({
    name: '',
    code: '',
    price: 0,
    desc: '',
    group_id: 0,
    quantity: 0,
    flag: 0,
 });

 const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (typeof product.group_id === 'string') {
    product.group_id = parseInt(product.group_id, 10);
  }

  if (typeof product.price === 'string') {
    product.price = parseFloat(product.price);
  }
  
  try {
     console.log(JSON.stringify(product));
     const response = await ProductController.add(product); // Directly pass the product object
     // Handle the result here, e.g., show a success message or update the product list
     console.log('Product added successfully:', response);
  } catch (error) {
     console.error('Error adding product:', error);
     // Handle errors, e.g., show an error message to the user
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
