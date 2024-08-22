const { describe, it, before } = require('mocha');
const dotenv = require('dotenv');

// Load environment variables from config.env
dotenv.config({ path: './server/config.env' });

let expect;
let connectDB;

before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
    connectDB = (await import('../server/db.js')).default;
});

describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
        try {
            // Checking connection to the database
            const db = await connectDB();
            expect(db).to.be.an('object');
            expect(db.databaseName).to.equal('recipeApp');
        } catch (error) {
            throw new Error('Failed to connect to the database');
        }
    });

    it('should handle errors', async () => {
        try {
            // Checking connection to the database
            await connectDB('invalid-url');
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });
});