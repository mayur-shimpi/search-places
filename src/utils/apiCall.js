import axios from 'axios';

const baseUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const headers = {
    'x-rapidapi-key': '945cc1fc9bmsh2c9afa82ededd82p1537e0jsne7faae44c235',
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
};

export const apiRequest = async (url, method = 'GET', params = {}, body = {}) => {
    let completeUrl = baseUrl + url;
    const options = {
        method: method,
        url: completeUrl,
        headers: headers,
        params: params,
        data: body,
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("API call error:", error);
        throw error;
    }
};
