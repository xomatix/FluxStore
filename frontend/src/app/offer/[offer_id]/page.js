"use client";
import { OfferController } from "@/controllers/offerController";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const OfferView = () => {
  const [offer, setOffer] = useState({
    name: "",
    price: 0,
    quantity: 0,
    disc_price: 0,
    valuelist: [],
    code: "",
    discount: 0,
  });

  const params = useParams();
  useEffect(() => {
    async function fetchData() {
      var inputModel = {
        ids: [Number(params.offer_id)],
      };
      var data = await OfferController.list(inputModel);
      data = data.data[0];
      setOffer({
        ...offer,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        disc_price: data.disc_price,
        valuelist: data.valuelist,
        code: data.code,
        discount: data.discount,
      });
    }
    fetchData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "200px",
            backgroundColor: "red",
            position: "relative",
          }}
        >
          {/* Replace 'path/to/image.jpg' with your actual image path */}
          <Image
            src="/path/to/image.jpg"
            alt={offer.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div style={{ width: "45%" }}>
          <h2>Title: {offer.name}</h2>
          <p>Price: ${offer.disc_price}</p>
          <p>Quantity: {offer.quantity}</p>
        </div>
      </div>
      <div>valuelist: {JSON.stringify(offer.valuelist)}</div>
    </div>
  );
};

export default OfferView;
