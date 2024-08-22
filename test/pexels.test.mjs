import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getImageByTitle } from '../server/api/pexels/client.js';

describe('getImageByTitle', () => {
    let mock;

    before(() => {
        mock = new MockAdapter(axios);
    });

    after(() => {
        mock.restore();
    });

    it('should return the image URL when a valid image name is provided', async () => {
        const imageName = 'test-image';
        const imageUrl = '';

        mock.onGet('https://api.pexels.com/v1/search', {
            params: {
                query: imageName,
                per_page: 1
            }
        }).reply(200, {
            photos: [
                {
                    src: {
                        original: imageUrl
                    }
                }
            ]
        });

        const result = await getImageByTitle(imageName);
        expect(result).to.include('https://images.pexels.com/photos/');
    });

    it('should throw an error when the API request fails', async () => {
        const imageName = '';

        mock.onGet('https://api.pexels.com/v1/search', {
            params: {
                query: imageName,
                per_page: 1
            }
        }).reply(500);

        try {
            await getImageByTitle(imageName);
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
        }
    });
});