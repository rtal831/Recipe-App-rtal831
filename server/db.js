const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const uri = process.env.MONGO_URI;
let db;

const connectDB = async () => {
    if (db) return db; // Return the existing connection if already connected

    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to Database');
        db = client.db('recipeApp');
        return db;
    } catch (error) {
        console.error('Failed to connect to the database', error);
        throw error;
    }
};

module.exports = connectDB;