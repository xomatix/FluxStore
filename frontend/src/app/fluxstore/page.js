"use client"
import NavigationBar from '@/components/NavigationBar';
import SearchOffers from '@/components/SearchOffers';
import { OfferController } from '@/controllers/offerController.js';
import { useEffect, useState } from 'react';
import './page.css';

const Page = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchRandomOffers = async () => {
            const inputModel = {
                random: true,
                filter: [],
                rows: 30,
                page: 0,
            };

            try {
                const response = await OfferController.list(inputModel);
                if (response.data && response.data.length > 0) {
                    setOffers(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch random offers:', error);
            }
        };

        fetchRandomOffers();
    }, []);

    const handleLinkRedirect = (e, link) => {
        e.preventDefault();
        window.location.href = `${link}`;
    }
    
    return (
        <div className="store-landing-page">
            <div className="main-content">
                <h1>Welcome to Our Store</h1>
                <SearchOffers />
                <NavigationBar />
                <div className="offers-list">
                    {offers.map((offer) => (
                        <div key={offer.id} className="offer-item" onClick={(e) => handleLinkRedirect(e, "/offer/" + offer.id)}>
                            <h2>{offer.name}</h2>
                            <img src={`https://student.agh.edu.pl/~maswierc/object_files${offer.photos[0]?.path}`} alt={offer.name} onClick={(e) => handleLinkRedirect(e, "/offer/" + offer.id)} />
                            <p>Price: {offer.disc_price} </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;

