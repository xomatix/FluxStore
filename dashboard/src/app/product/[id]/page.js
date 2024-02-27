"use client";
import { useEffect, useState } from 'react';

const EditProduct = (id) => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    code: '',
    price: '',
    desc: '',
    group_id: '',
    quantity: '',
    flag: '',
  });


  useEffect(() => {
    console.log("my id is"+ id);
    // Fetch product data here and set it to the state
    // This is a placeholder for your actual fetch logic
    // You might want to replace this with an actual fetch call to your backend
    const fetchProductData = async () => {
      // Simulate fetching product data
      const fetchedProduct = {
        id:  2,
        name: "Nike air force",
        code: "NIKECW2288-111",
        price: "559.00",
        desc: "Example shoe description",
        group_id:  1,
        quantity:  10,
        flag:  0,
      };
      setProduct(fetchedProduct);
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(product);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(`http://localhost:8080/product/edit/${id}`, requestOptions);
      const result = await response.text();
      console.log(result);
      // Handle success (e.g., redirect to product list, show success message)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
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

export default EditProduct;
