"use client";
import { useEffect, useState } from 'react';
import { OfferController } from "@/controllers/offerController";

const OfferPage = () => {
    const [offers, setOffers] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const filters = [];

                if (nameFilter) {
                    filters.push({ field: 'name', comparer: 'ilike', argument: `%${nameFilter}%` });
                }

                if (priceFilter) {
                    filters.push({ field: 'price', comparer: '>', argument: priceFilter });
                }

                let query = {
                    filter: filters,
                    rows: 30,
                    page: 0,
                };

                console.log('Query:', query);

                let data = await OfferController.list(query);
                console.log('Data:', data);
                data=data.data;
                setOffers(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, [nameFilter, priceFilter]);

    const handleGroupRedirect = (e, id) => {
        console.log(`Redirect to offer details with ID: ${id}`);
    };

    return (
        <div>
            <div>
                <label>Name Filter:</label>
                <input
                    type="text"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
            </div>
            <div>
                <label>Price Filter:</label>
                <input
                    type="number"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                />
            </div>

            {offers.length > 0 ? (
                offers.map((x, i) => (
                    <div
                        key={i}
                        className={"row"}
                        onClick={(e) => handleGroupRedirect(e, x.id)}
                    >
                        <div className={"cell"}>{x.id}</div>
                        <div className={"cell"}>{x.name}</div>
                        <div className={"cell"}>{x.disc_price}</div>
                    </div>
                ))
            ) : (
                <p>No offers found</p>
            )}
        </div>
    );
};

export default OfferPage;
