const assert = require('chai').assert;
const mocha = require('mocha');
const request = require('request');

const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;
const it = mocha.it;

const app = require('../app/index').jlelse.maily.Server.app;
let port, server, url;

beforeEach((done) => {
    server = app.listen(0, () => {
        port = server.address().port;
        url = `http://localhost:${port}/`;
        done();
    });
});

afterEach((done) => {
    server.close(done);
});

describe('Front page', () => {
	describe('GET /', () => {

		it('returns HTTP status code 200', (done) => {
			request(url, (error, response) => {
				assert.equal(response.statusCode, 200);
				done();
			});
		});

		it('returns HTML content', (done) => {
			request(url, (error, response, body) => {
			    assert.include(body, 'Maily-Form');
			    assert.include(body, 'works');
				done();
			});
		});
	});
});

