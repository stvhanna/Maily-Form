const express = require('express');
const marked = require('marked');

const db = require('../lib/database').
    connect();

/* eslint-disable-next-line new-cap */
const router = express.Router();

router.get('/all', (req, res) => get(1, res));
router.get('/spam', (req, res) => get(2, res));
router.get('/:id', (req, res) => getId(req.params.id, res));
router.delete('/:id', (req, res) => delId(req.params.id, res));

function get(sent, res) {
    getSubmissionsFromDB(sent, (err, submissions) => {
        if (err) {
            res.json({
                success: false,
                response: null
            });
        } else {
            res.json({
                success: true,
                result: {
                    submissions: submissions.map((submission) => ({
                        id: submission.id,
                        time: (new Date(submission.time).toLocaleString()),
                        formName: submission.formName,
                        replyTo: submission.replyTo,
                        text: marked(submission.text).
                            replace(/\n*$/, "")
                    }))
                }
            });
        }
    });
}

function getId(id, res) {
    getSubmissionFromDB(id, (err, submissions) => {
        if (err) {
            res.json({
                success: false,
                response: null
            });
        } else {
            res.json({
                success: true,
                result: {
                    submissions: submissions.map((submission) => ({
                        id: submission.id,
                        time: (new Date(submission.time).toLocaleString()),
                        formName: submission.formName,
                        replyTo: submission.replyTo,
                        text: marked(submission.text).
                            replace(/\n*$/, "")
                    }))
                }
            });
        }
    });
}


function delId(id, res) {
    deleteSubmissionFromDB(id, (err) => {
        res.json({
            success: err === null,
            error: err
        })
    })
}

function getSubmissionsFromDB(sent, callback) {
    let sql = `SELECT * FROM submissions ORDER BY time DESC`;
    if (sent) sql = `SELECT * FROM submissions WHERE sent = ${sent} ORDER BY time DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else callback(null, rows);
    });
}

function getSubmissionFromDB(id, callback) {
    db.all(`SELECT * FROM submissions WHERE id=(?)`, [id], (err, rows) => {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else callback(null, rows);
    });
}

function deleteSubmissionFromDB(id, callback) {
    db.run('DELETE FROM submissions WHERE id=(?)', [id], (err) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('Entry deleted from DB');
            callback(null);
        }
    });
}

module.exports = router;

