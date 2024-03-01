"use client"
import { OfferController } from '@/controllers/offerController.js';
import { useEffect, useState } from 'react';

const SearchOffers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            const inputModel = {
                filter: [],
                rows: 30,
                page: 0
            };
            const response = await OfferController.list(inputModel);
            setOffers(response.data || []);
        };

        fetchOffers();
    }, []);

    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        if (query.trim() !== '') {
            const filtered = offers.filter(offer => offer.name.toLowerCase().includes(query.toLowerCase()));
            setFilteredOffers(filtered);
        } else {
            setFilteredOffers([]);
        }
    };

    const handleLinkRedirect = (e, link) => {
        e.preventDefault();
        window.location.href = `${link}`;
    }
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
                        <div key={index} className="search-result" onClick={(e) => handleLinkRedirect(e, "/offer/" + offer.id)}>
                            <p>{offer.name} - {offer.disc_price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchOffers;
