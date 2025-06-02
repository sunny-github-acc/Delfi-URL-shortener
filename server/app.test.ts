const request = require('supertest');
const app = require('./app'); // Your express app

describe('POST /api/shorten', () => {
    it('should return 400 if url is missing', async () => {
        const res = await request(app).post('/api/shorten').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'No URL provided');
    });

    it('should return shortUrl if url is provided', async () => {
        const res = await request(app)
            .post('/api/shorten')
            .send({ url: 'https://example.com' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('shortUrl');
    });
});
