"use client";
import { FileController } from "@/controllers/fileController";
import { GroupController } from "@/controllers/groupController";
import { ProductValueController } from "@/controllers/productValueController";
import { ProductValueModelController } from "@/controllers/productValueModelController";
import { ProductController } from "@/controllers/productcontroller";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.css";

const ProductUpdate = () => {
  const [product, setProductData] = useState({
    name: "",
    code: "",
    price: 0,
    desc: "",
    group_id: 0,
    quantity: 0,
    flag: 0,
    photos: [],
  });
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    code: "",
    flag: 0,
  });
  const [valueModelData, setValueModelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
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
        photos: data.photos,
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
          valueElement.product_id = product.id;
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
        await ProductValueController.add(vmInputModel);
      });

      window.location.href = "/product/update/" + response;
      try {
        const response = await FileController.add(selectedFile, Number(product.id));
        const newImage = response.data;
        setProductData(prevState => ({
          ...prevState,
          images: [...(prevState.images || []), newImage]
        }));
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    };
  };

  const handleGroupRedirect = (e) => {
    e.preventDefault();
    if (formData.id == 0) return;
    window.open(`/group/${formData.id}`, "_blank", "noopener,noreferrer");
  };

  const [previewImage, setPreviewImage] = useState(null);

  const fileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
      setSelectedFile(file);
    }
  };




  return (
    <form onSubmit={handleSubmit} className={"container"}>

      <label>
        <p>Name:</p>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </label>
      <label>
        <p>Code:</p>
        <input
          readOnly={true}
          type="text"
          name="code"
          value={product.code}
          onChange={handleChange}
        />
      </label>
      <label>
        <p>Price:</p>
        <input
          type="text"
          name="price"
          value={product.price}
          onChange={handleChange}
        />
      </label>
      <label>
        <p>Description:</p>
        <textarea name="desc" value={product.desc} onChange={handleChange} />
      </label>
      <label>
        <p>Quantity:</p>
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
        />
      </label>
      <label>
        <p>Flag:</p>
        <input
          type="number"
          name="flag"
          value={product.flag}
          onChange={handleChange}
        />
      </label>
      <label>
        <p>Group:</p>
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
              <p>{x.name}:</p>
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
      <h3>
        <b>Photos</b>
      </h3>
      <input type="file" onChange={fileChange} />
      <div className="offers-list">
        {product.photos.map((photo, index) => (
          <div key={index} className="offer-item">
            <img src={`https://student.agh.edu.pl/~maswierc/object_files/${photo.path}`} alt={`Product Image ${index + 1}`} />
          </div>
        ))}
        {previewImage && (
          <div className="offer-item">
            <img src={previewImage} alt="Selected Image" />
          </div>
        )}
      </div>


      <div className={"center"}>
        <button className="btn-primary" type="submit">
          Update Product
        </button>
      </div>
    </form>
  );

};

export default ProductUpdate;
