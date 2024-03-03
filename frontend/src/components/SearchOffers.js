"use client"
import { OfferController } from '@/controllers/offerController.js';
import { useEffect, useState } from 'react';

function useOffers(initialQuery = '') {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const inputModel = {
                    filter: [],
                    rows: 30,
                    page: 0
                };
                const response = await OfferController.list(inputModel);
                setOffers(response.data || []);
            } catch (error) {
                setError("Failed to fetch offers.");
                console.error("Failed to fetch offers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            const filtered = offers.filter(offer => offer.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredOffers(filtered);
        } else {
            setFilteredOffers([]);
        }
    }, [searchQuery, offers]);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLinkRedirect = (e, link) => {
        e.preventDefault();
        window.location.href = `${link}`;
    };

    return { searchQuery, setSearchQuery, filteredOffers, handleInputChange, handleLinkRedirect, isLoading, error };
}

const SearchOffers = () => {
    const { searchQuery, filteredOffers, handleInputChange, handleLinkRedirect, isLoading, error } = useOffers();

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
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
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
