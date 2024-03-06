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
        desc: data.desc,
        discount: data.discount,
        photos: data.photos,
      });
    }
    fetchData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {offer.photos != undefined && offer.photos.length > 0
            ? offer.photos.map((x) => {
                return (
                  <img
                    src={`https://student.agh.edu.pl/~maswierc/object_files${x.path}`}
                    alt={`Image of ${offer.name}`}
                    width={500}
                    height={500}
                    layout="responsive"
                  />
                );
              })
            : ""}
          <h1>{offer.name}</h1>
          <p>Price: ${offer.price}</p>
          <p>Description: {offer.description}</p>
          <p>Quantity: {offer.quantity}</p>
        </div>
        <div className="product-page">
          <h3>Specific Values:</h3>
          <div>
            {Object.entries(offer.valuelist).map((x) => {
              x = x[1];
              return (
                <p key={x.model_id}>
                  <b>{x.name}</b>: {x.value}
                </p>
              );
            })}
          </div>
        </div>
        <div>{offer.desc}</div>
      </div>

      {/* <div>valuelist: {JSON.stringify(offer.valuelist)}</div> */}
    </div>
  );
};

export default OfferView;
