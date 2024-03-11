"use client"
import { OfferController } from '@/controllers/offerController.js';
import { useEffect, useState } from 'react';

const SearchOffers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await OfferController.list('{}');
                setOffers(response);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const filtered = offers.filter((offer) =>
            offer.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredOffers(filtered);
    };

    return (
        <div>
            <form>
                <input
                    type="text"
                    placeholder="Search offers..."
                    value={searchQuery}
                    onChange={handleInputChange}
                />
            </form>
            {filteredOffers.length > 0 && (
                <div className="popup-search-results">
                    {filteredOffers.map((offer, index) => (
                        <div key={index} className="search-result">
                            <p>{offer.price}</p>
                            <p>{offer.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchOffers;
