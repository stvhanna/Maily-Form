package jlelse.maily.routes

import jlelse.maily.lib.Database
import jlelse.maily.require
import kotlin.js.Date
import kotlin.js.json

object Api {
    private val express = require("express")
    private val marked = require("marked")
    private val db = Database.connect()

    val router: dynamic = express.Router()

    init {
        router.get("/sent") { _, res ->
            get(1, res)
        }
        router.get("/spam") { _, res ->
            get(2, res)
        }
        router.get("/:id") { req, res ->
            getId((req.params.id as? String)?.toIntOrNull() ?: -1, res)
        }
        router.delete("/:id") { req, res ->
            delId((req.params.id as? String)?.toIntOrNull() ?: -1, res)
        }
    }

    fun get(sent: Int, res: dynamic) {
        getSubmissionsFromDB(sent) { err, submissions ->
            if (err != null || submissions == null) {
                if (err != null) console.log(err as Any)
                res.json(json("success" to false, "result" to null)) as? Unit
            } else {
                res.json(json(
                        "success" to true,
                        "result" to json(
                                "submissions" to submissions.map { submission ->
                                    json(
                                            "id" to submission.id,
                                            "time" to Date(submission.time as Number).toUTCString(),
                                            "formName" to submission.formName,
                                            "replyTo" to submission.replyTo,
                                            "text" to marked(submission.text).replace("/\n*$/", "")
                                    )
                                })
                )) as? Unit
            }
        }
    }

    fun getId(id: Int, res: dynamic) {
        getSubmissionFromDB(id) { err, submission ->
            if (err != null || submission == null) {
                if (err != null) console.log(err as Any)
                res.json(json("success" to false, "result" to null)) as? Unit
            } else {
                res.json(json(
                        "success" to true,
                        "result" to json(
                                "id" to submission.id,
                                "time" to Date(submission.time as Number).toUTCString(),
                                "formName" to submission.formName,
                                "replyTo" to submission.replyTo,
                                "text" to marked(submission.text).replace("/\n*$/", "")
                        )
                )) as? Unit
            }
        }
    }

    private fun delId(id: Int, res: dynamic) {
        deleteSubmissionFromDB(id) { err ->
            if (err != null) console.log(err as Any)
            res.json(json("success" to (err == null))) as? Unit
        }
    }

    private fun getSubmissionsFromDB(sent: Int, callback: (err: dynamic, rows: dynamic) -> Unit) {
        db.all("SELECT * FROM submissions WHERE sent = (?) ORDER BY time DESC", arrayOf(sent)) { err, rows ->
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
}
