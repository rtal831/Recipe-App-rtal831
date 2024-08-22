import { describe, it, before, after } from 'mocha';
import http from 'http';
import dotenv from 'dotenv';
import app from '../server/server.js';
import * as chai from 'chai';
import axios from 'axios';

dotenv.config({ path: './server/config.env' });

const { expect } = chai;

let server;

before((done) => {
    server = app.listen(5001, () => {
        console.log('Test server running on port 5001');
        done();
    });
});

after((done) => {
    if (server) {
        server.close(() => {
            console.log('Test server stopped');
            done();
        });
    } else {
        done();
    }
});

describe('Server', () => {
    it('should start the server successfully', (done) => {
        http.get('http://localhost:5001/api/server', (res) => {
            expect(res.statusCode).to.equal(200);
            done();
        }).on('error', (err) => {
            done(err);
        });
    });

    it('should access the /api/recipes route', (done) => {
        http.get('http://localhost:5001/api/recipes', (res) => {
            expect(res.statusCode).to.equal(200);
            done();
        }).on('error', (err) => {
            done(err);
        });
    });

    it('should store generated recipes successfully', async () => {
        const response = await axios.post('http://localhost:5001/api/server/generated-recipes', {
            recipes: [{ 'result-id': 1, name: 'Recipe 1' }]
        });
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('message', 'Recipes stored successfully');
    });

    it('should return stored generated recipes', async () => {
        const response = await axios.get('http://localhost:5001/api/server/generated-recipes');
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('generatedRecipes').that.is.an('array').with.lengthOf(1);
    });

    it('should return a specific recipe by resultId', async () => {
        const response = await axios.get('http://localhost:5001/api/server/generated-recipes/1');
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('name', 'Recipe 1');
    });

    it('should return 404 for a non-existent recipe', async () => {
        try {
            await axios.get('http://localhost:5001/api/server/generated-recipes/999');
        } catch (error) {
            expect(error.response.status).to.equal(404);
            expect(error.response.data).to.have.property('error', 'Recipe not found');
        }
    });

    it('should clear generated recipes', async () => {
        const response = await axios.delete('http://localhost:5001/api/server/generated-recipes');
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('generatedRecipes').that.is.an('array').with.lengthOf(0);
    });
});