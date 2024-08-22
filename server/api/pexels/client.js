const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});

const API_URL = 'https://api.pexels.com/v1/search';
const apiKey = process.env.PEXELS_API_KEY;

const getImageByTitle = async (imageName) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                query: imageName,
                per_page: 1
            },
            headers: {
                'Authorization': apiKey
            }
        });

        console.log('Pexels API Response:', response.data);

        if (response.data?.photos?.length > 0) {
            return response.data.photos[0].src.original; // Returning the first image's URL
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching image from Pexels API:', error);
        throw error;
    }
};

module.exports = { getImageByTitle };