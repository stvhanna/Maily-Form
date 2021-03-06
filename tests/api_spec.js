const assert = require('chai').assert;
const mocha = require('mocha');
const request = require('request');

const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;
const it = mocha.it;

const app = require('../app/index').jlelse.maily.Server.app;
let port, server, url, authorizedOptions, spamOptions;

beforeEach((done) => {
    server = app.listen(0, () => {
        port = server.address().port;
        url = `http://localhost:${port}/api/get/selector/sent`;
        authorizedOptions = {
            url: url,
            auth: {
                user: 'admin',
                pass: 'admin'
            }
        };
        spamOptions = {
            url: `http://localhost:${port}/api/get/selector/spam`,
            auth: {
                user: 'admin',
                pass: 'admin'
            }
        };
        done();
    });
});

afterEach((done) => {
    server.close(done);
});

describe('API', () => {
    describe('GET /get/selector/sent', () => {

        it('returns HTTP status code 401 when not authorized', (done) => {
            request(url, (error, response) => {
                assert.equal(response.statusCode, 401);
                done();
            });
        });

        it('returns HTTP status code 200', (done) => {
            request(authorizedOptions, (error, response) => {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('returns JSON content', (done) => {
            request(authorizedOptions, (error, response, body) => {
                assert.include(body, 'success');
                done();
            });
        });
    });

    describe('GET /get/selector/spam', () => {

        it('returns JSON content', (done) => {
            request(spamOptions, (error, response, body) => {
                assert.include(body, 'success');
                done();
            });
        });
    });
});
