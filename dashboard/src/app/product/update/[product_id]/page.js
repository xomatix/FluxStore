"use client";
import { GroupController } from "@/controllers/groupController";
import { ProductValueController } from "@/controllers/productValueController";
import { ProductController } from '@/controllers/productcontroller';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductUpdate = () => {
  const [product, setProductData] = useState({
    name: '',
    code: '',
    price: 0,
    desc: '',
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
      
      setValueModelData(data.valuelist);
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
      var vmData = await ProductValueController.list(vmInputModel);
      vmData = vmData.data;
      if (vmData == null || vmData == undefined) return;
      setValueModelData(vmData);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setProductData({ ...product, [e.target.name]: e.target.value });
  };

  const handleChangeGroup = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  
      window.location.href = "/product/update/" + response;
    }
    console.log(product);
  
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
        await ProductValueController.add(vmInputModel);
      });
    
      if (valueModelData.name != "" && valueModelData.code != "") {
        await ProductValueController.add(valueModelData);
      }
      window.location.href = "/product/update/" + response;
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
       <label>
         Group name:
         <input
           readOnly={true}
           type="text"
           name="name"
           value={formData.name}
           onChange={handleChangeGroup}
         />
       </label>
       <label>
         Group Code:
         <input
           readOnly={true}
           type="text"
           name="code"
           value={formData.code}
         />
       </label>
   
       <h3>
         <b>Product Value Model</b>
       </h3>
       <div className="cards-container">
         {valueModelData.map((x, i) => (
           <div key={i} className="card">
             <label>
               Name:
               <input
                 readOnly={true}
                 type="text"
                 name="name"
                 value={x.name}
               />
             </label>
             <label>
               Value:
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
   
       <button type="submit">Update Product</button>
    </form>
   );
   
};



export default ProductUpdate;
