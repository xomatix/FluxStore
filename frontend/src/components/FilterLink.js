import React from 'react';
import { Link } from 'react-router-dom';

const FilterLink = ({ filter, children, onFilterChange }) => {
    const handleFilterChange = () => {
        onFilterChange(filter);
    };

    return (
        <Link to={`/offers/${filter}`} style={{ marginRight: '10px' }} onClick={handleFilterChange}>
            {children}
        </Link>
    );
};

export default FilterLink;
