"use client"
import NavigationBar from './components/NavigationBar';
import SearchOffers from './components/SearchOffers';

const Page = () => {
 return (
    <div className="store-landing-page">
      <NavigationBar />
      <div className="main-content">
        <h1>Welcome to Our Store</h1>
        <SearchOffers />
        {/* Add more content here as needed */}
      </div>
      {/* Optionally, include a footer component */}
    </div>
 );
};

export default Page;
