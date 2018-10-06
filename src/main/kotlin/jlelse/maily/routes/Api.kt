package jlelse.maily.routes

import jlelse.maily.lib.Config
import jlelse.maily.lib.Database
import jlelse.maily.lib.Transporter
import jlelse.maily.require
import kotlin.js.Date
import kotlin.js.Json
import kotlin.js.json

object Api {
    private val express = require("express")
    private val marked = require("marked")
    private val db = Database.connect()

    val router: dynamic = express.Router()

    init {
        router.get("/info") { _, res ->
            info(res)
        }
        router.get("/sent") { _, res ->
            get(1, res)
        }
        router.get("/spam") { _, res ->
            get(2, res)
        }
        router.get("/archive") { _, res ->
            get(10, res, ">")
        }
        router.get("/:id") { req, res ->
            getId((req.params.id as? String)?.toIntOrNull() ?: -1, res)
        }
        router.delete("/:id") { req, res ->
            delId((req.params.id as? String)?.toIntOrNull() ?: -1, res)
        }
        router.post("/archive/:id") { req, res ->
            archiveId((req.params.id as? String)?.toIntOrNull() ?: -1, res)
        }
        router.delete("/archive/:id") { req, res ->
            unarchiveId((req.params.id as? String)?.toIntOrNull() ?: -1, res)
        }
        router.post("/respond/:id") { req, res ->
            respondId((req.params.id as? String)?.toIntOrNull() ?: -1, (req.body?.text as? String) ?: "", res)
        }
    }

    private fun info(res: dynamic) {
        res.json(json(
                "success" to true,
                "result" to json(
                        "title" to Config.adminRealm
                )
        ))
    }

    private fun get(status: Int, res: dynamic, statusComparator: String = "=") {
        getSubmissionsFromDB(status, statusComparator) { err, submissions ->
            if (err != null || submissions == null) {
                if (err != null) console.log(err as Any)
                res.json(json("success" to false, "result" to null)) as? Unit
            } else {
                res.json(json(
                        "success" to true,
                        "result" to json(
                                "submissions" to submissions.map { submission ->
                                    submissionToJson(submission)
                                })
                )) as? Unit
            }
        }
    }

    private fun getId(id: Int, res: dynamic) {
        getSubmissionFromDB(id) { err, submission ->
            if (err != null || submission == null) {
                if (err != null) console.log(err as Any)
                res.json(json("success" to false, "result" to null)) as? Unit
            } else {
                res.json(json(
                        "success" to true,
                        "result" to submissionToJson(submission)
                )) as? Unit
            }
        }
    }

    private fun submissionToJson(submission: dynamic): Json {
        return json(
                "id" to submission.id,
                "time" to Date(submission.time as Number).toUTCString(),
                "formName" to submission.formName,
                "replyTo" to submission.replyTo,
                "text" to marked(submission.text).replace("/\n*$/", ""),
                "response" to submission.response
        )
    }

    private fun delId(id: Int, res: dynamic) {
        deleteSubmissionFromDB(id) { err ->
            if (err != null) console.log(err as Any)
            res.json(json("success" to (err == null))) as? Unit
        }
    }

    private fun archiveId(id: Int, res: dynamic) {
        archiveSubmissionFromDB(id) { err ->
            if (err != null) console.log(err as Any)
            res.json(json("success" to (err == null))) as? Unit
        }
    }

    private fun unarchiveId(id: Int, res: dynamic) {
        unarchiveSubmissionFromDB(id) { err ->
            if (err != null) console.log(err as Any)
            res.json(json("success" to (err == null))) as? Unit
        }
    }

    private fun respondId(id: Int, text: String, res: dynamic) {
        if (!text.isBlank()) {
            getSubmissionFromDB(id) { err, row ->
                if (err != null) {
                    console.log(err as Any)
                    res.json(json("success" to false)) as? Unit
                } else {
                    // Setup mail
                    val mailOptions = json(
                            "from" to Config.emailFrom,
                            "to" to row.replyTo,
                            "subject" to "Reply to your submission on ${row.formName}",
                            "markdown" to "$text  \n  \n**Your submission:**  \n${row.text}"
                    )
                    // Send mail
                    Transporter.transporter.sendMail(mailOptions) { error, _ ->
                        if (error != null) {
                            console.log(error as Any)
                            res.json(json("success" to false)) as? Unit
                        } else addResponseToDB(id, text) { err2 ->
                            if (err2 != null) console.log(err2 as Any)
                            res.json(json("success" to (err2 == null))) as? Unit
                        }
                    } as? Unit
                }
            }
        }
    }

    private fun getSubmissionsFromDB(status: Int, statusComparator: String, callback: (err: dynamic, rows: dynamic) -> Unit) {
        db.all("SELECT * FROM submissions WHERE status $statusComparator (?) ORDER BY time DESC", arrayOf(status)) { err, rows ->
            if (err != null) callback(err, null) else callback(null, rows)
        }
    }

    private fun getSubmissionFromDB(id: Int, callback: (err: dynamic, row: dynamic) -> Unit) {
        db.get("SELECT * FROM submissions WHERE id=(?)", arrayOf(id)) { err, row ->
            if (err != null) callback(err, null) else callback(null, row)
        }
    }

    private fun deleteSubmissionFromDB(id: Int, callback: (err: dynamic) -> Unit) {
        db.run("DELETE FROM submissions WHERE id=(?)", arrayOf(id)) { err ->
            if (err != null) callback(err) else callback(null)
        }
    }

    // To archive the status gets increased by 10
    private fun archiveSubmissionFromDB(id: Int, callback: (err: dynamic) -> Unit) {
        db.run("UPDATE submissions SET status=status+10 WHERE id=(?)", arrayOf(id)) { err ->
            if (err != null) callback(err) else callback(null)
        }
    }

    // To unarchive the status gets decreased by 10
    private fun unarchiveSubmissionFromDB(id: Int, callback: (err: dynamic) -> Unit) {
        db.run("UPDATE submissions SET status=status-10 WHERE id=(?)", arrayOf(id)) { err ->
            if (err != null) callback(err) else callback(null)
        }
    }

    private fun addResponseToDB(id: Int, text: String, callback: (err: dynamic) -> Unit) {
        db.run("UPDATE submissions SET response=(?) WHERE id=(?)", arrayOf(text, id)) { err ->
            if (err != null) callback(err) else callback(null)
        }
    }
}
