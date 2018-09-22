const assert = require('chai').assert;
const mocha = require('mocha');
const request = require('request');

const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;
const it = mocha.it;

const withSmtpServer = require('./lib/with_smtp_server');

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

describe('Forms API', () => {
    describe('POST /', () => {
        it('sends email and returns HTTP status code 200', (done) => {
            let formData = {};
            withSmtpServer({
                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, response) => {
                            assert.equal(response.statusCode, 200);
                        }
                    );
                },
                onClose: () => {
                    done();
                }
            });
        });

        it('sends email and takes _replyTo in account in mail header (when set)', (done) => {
            let formData = {
                "_replyTo": 'loveIsAll@example.com'
            };
            let messageCounter = 0;
            withSmtpServer({
                onMessage: (mailObject) => {
                    messageCounter += 1;
                    assert.equal(mailObject.headers['reply-to'], formData._replyTo);
                },
                onListen: () => {
                    request.post({ url, formData });
                },
                onClose: () => {
                    assert.equal(messageCounter, 1);
                    done();
                }
            });
        });

        it('sends email and redirects according to _redirectTo (when set)', (done) => {
            let formData = {
                "_redirectTo": 'https://example.com'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: () => { messageCounter += 1; },
                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, response) => {
                            assert.equal(response.headers.location, formData._redirectTo);
                        }
                    );
                },
                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });

        });

        it('send email with formName in title (when set)', (done) => {
            let formData = {
                "_formName": 'loveIsAll'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (mailObject) => {
                    messageCounter += 1;
                    assert.include(mailObject.subject, formData._formName);
                },
                onListen: () => {
                    request.post({ url, formData });
                },
                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });
        });

        it('sanitizes HTML in message and other fields', (done) => {
            let formData = {
                "message": "html<script>console.log('test')</script>"
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (mailObject) => {
                    messageCounter += 1;
                    assert.notInclude(mailObject.html, 'script');
                    assert.notInclude(mailObject.text, 'script');
                },
                onListen: () => {
                    request.post({ url, formData });
                },
                onClose: () => {
                    assert.equal(messageCounter, 1);
                    done();
                }
            });
        });

        it('blocks email when _t_email is not empty', (done) => {
            let formData = {
                "_t_email": 'iAmABot'
            };
            let messageCounter = 0;
            withSmtpServer({
                onMessage: () => { messageCounter += 1; },
                onListen: () => {
                    request.post({ url, formData });
                },
                onClose: () => {
                    assert.strictEqual(messageCounter, 0);
                    done();
                }
            });
        });

        it('returns a success message', (done) => {
            let formData = {};
            let messageCounter = 0;

            withSmtpServer({
                onMessage: () => { messageCounter += 1; },
                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, body) => {
                            assert.include(body, 'success');
                        }
                    );
                },
                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });
        });
    });
});

