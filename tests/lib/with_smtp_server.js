const config = require('../../app/index').jlelse.maily.lib.Config;
const SMTPServer = require('smtp-server').SMTPServer;
const MailParser = require('mailparser-mit').MailParser;

function withSmtpServer(callbackObj) {
    let listenTimeout = 1000;
    let mailparser = new MailParser();

    let closing = false;
    function onListen () {
        if (callbackObj.onListen) {
            callbackObj.onListen();
        }
    }

    function onMessage (mailObject) {
        if (callbackObj.onMessage) {
            callbackObj.onMessage(mailObject);
        }
    }

    function onClose () {
        if (closing) return;
        closing = true;
        if (callbackObj.onClose) {
            callbackObj.onClose();
        }
    }

    let server = new SMTPServer({
        secure: false,
        authOptional: true,
        socketTimeout: 1000,
        closeTimeout: 1000,
        onData(stream, session, callback) {
            mailparser.on('end', (mailObject) => {
                onMessage(mailObject);
                server.close(onClose);
            });
            stream.pipe(mailparser);
            return callback();
        }
    });

    server.listen(config.smtpPort, () => {
        setTimeout(() => {
            server.close(onClose)
        }, listenTimeout);
        onListen();
    });
}

module.exports = withSmtpServer;
