import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/apiCall';
import './style.css';
import SearchBox from '../searchBox';

const PlacesTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInitiated, setSearchInitiated] = useState(false);
    const itemsPerPage = 3;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (searchInitiated) {
            setTimeout(() => {
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                const filtered = data.filter(city =>
                    city.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    city.country.toLowerCase().includes(lowercasedSearchTerm)
                );
                setFilteredData(filtered);
                setCurrentPage(1);
                setSearchInitiated(false);
                setLoading(false);
            }, 1000);
        }
    }, [data, searchTerm, searchInitiated]);

    const fetchCities = async (retryCount = 3) => {
        const url = '/cities';

        try {
            const response = await apiRequest(url, 'GET');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            if (retryCount > 0) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                return fetchCities(retryCount - 1);
            } else {
                setError(error.message);
                setLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        setLoading(true);
            setSearchInitiated(true);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value?.length === 0) {
            setFilteredData([]);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const noData = (filteredData?.length === 0 && searchInitiated) || (currentItems?.length === 0);
    const searchEmpty = searchTerm.trim() === '';

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredData?.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>

            <SearchBox
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
            />
            {loading && <div className="spinner"></div>}

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Place Name</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                    {searchEmpty ? (
                        <tr>
                            <td colSpan="3">Start searching</td>
                        </tr>
                    ) : noData ? (
                        <tr>
                            <td colSpan="3">No results found</td>
                        </tr>
                    ) : (
                        currentItems.map((city, index) => (
                            <tr key={city.id}>
                                <td>{startIndex + index + 1}</td>
                                <td>{city.name}</td>
                                <td>{city.countryCode ? <img height={50} width={55} src={`https://flagsapi.com/${city.countryCode}/flat/64.png`} alt="Flag" /> : 'NA'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {!noData && filteredData?.length > 0 && (
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage * itemsPerPage >= filteredData?.length}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlacesTable;
