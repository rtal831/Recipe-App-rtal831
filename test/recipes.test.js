const { describe, it, before, after } = require('mocha');
const http = require('http');
const app = require('../server/server');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: './server/config.env' });

let chai;
let expect;
let server;
let db;

before(async () => {
    chai = await import('chai');
    expect = chai.expect;

    // Connect to the database
    const client = await MongoClient.connect(process.env.MONGO_URI);
    db = client.db();
    app.locals.db = db;

    // Start the server on a different port to avoid conflict
    const port = 5002;
    server = app.listen(port, () => {
        console.log(`Test server running on port ${port}`);
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

describe('Recipes API', () => {
    let recipeId;

    it('should get all recipes', (done) => {
        http.get('http://localhost:5001/api/recipes', (res) => {
            expect(res.statusCode).to.equal(200);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const recipes = JSON.parse(data);
                expect(recipes).to.be.an('array');
                done();
            });
        }).on('error', (err) => {
            done(err);
        });
    });

    it('should create a new recipe', (done) => {
        const postData = JSON.stringify({
            title: 'Test Recipe',
            ingredients: ['ingredient1', 'ingredient2'],
            detailedIngredients: 'Detailed ingredients',
            cookingTime: '30 minutes',
            instructions: 'Test instructions',
            recipeImage: 'http://example.com/image.jpg',
            tags: ['tag1', 'tag2']
        });

        const options = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/recipes',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = http.request(options, (res) => {
            expect(res.statusCode).to.equal(200);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const recipe = JSON.parse(data);
                expect(recipe).to.have.property('_id');
                recipeId = recipe._id;
                done();
            });
        });

        req.on('error', (err) => {
            done(err);
        });

        req.write(postData);
        req.end();
    });

    it('should get a specific recipe', (done) => {
        http.get(`http://localhost:5001/api/recipes/${recipeId}`, (res) => {
            expect(res.statusCode).to.equal(200);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const recipe = JSON.parse(data);
                expect(recipe).to.have.property('_id', recipeId);
                done();
            });
        }).on('error', (err) => {
            done(err);
        });
    });

    const deleteRequest = (path) => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 5001,
                path: path,
                method: 'DELETE'
            };

            const req = http.request(options, (res) => {
                expect(res.statusCode).to.equal(200);
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const response = JSON.parse(data);
                    resolve(response);
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.end();
        });
    };

    it('should delete a specific recipe', (done) => {
        deleteRequest(`/api/recipes/${recipeId}`)
            .then((response) => {
                expect(response).to.have.property('message', 'Recipe deleted');
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should delete all recipes', (done) => {
        deleteRequest('/api/recipes')
            .then((response) => {
                expect(response).to.have.property('message', 'All recipes deleted');
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});