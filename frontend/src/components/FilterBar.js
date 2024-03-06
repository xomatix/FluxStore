import React from 'react';
import FilterLink from './FilterLink';

const FilterBar = ({ onFilterChange }) => {
    return (
        <div>
            <FilterLink filter="category1" onFilterChange={onFilterChange}>
                Category 1
            </FilterLink>
            <FilterLink filter="category2" onFilterChange={onFilterChange}>
                Category 2
            </FilterLink>
            {}
        </div>
    );
};

export default FilterBar;
