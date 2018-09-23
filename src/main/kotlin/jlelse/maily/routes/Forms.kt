package jlelse.maily.routes

import jlelse.maily.lib.Config
import jlelse.maily.lib.Database
import jlelse.maily.lib.Transporter.transporter
import jlelse.maily.require
import kotlin.js.Date
import kotlin.js.json

object Forms {
    private val express = require("express")
    private val formidable = require("formidable")
    private val sanitizeHtml = require("sanitize-html")
    private val db = Database.connect()

    val router: dynamic = express.Router()

    init {
        router.post("/") { req, res ->
            processFormFields(req, res)
        }
    }

    private fun processFormFields(req: dynamic, res: dynamic) {
        var text = ""
        var to: String? = null
        var replyTo: String? = null
        var redirectTo: String? = null
        var formName: String? = null
        var botTest = true
        val form = formidable.IncomingForm()

        form.on("field") { dirtyField: String?, dirtyValue: String? ->
            val saniField = sanitizeHtml(dirtyField) as? String
            val saniValue = sanitizeHtml(dirtyValue) as? String

            when (saniField) {
                "_to" -> to = saniValue
                "_replyTo" -> replyTo = saniValue
                "_redirectTo" -> redirectTo = saniValue
                "_formName" -> formName = saniValue
                "_t_email" -> botTest = saniValue == ""
                else -> text += "**$saniField**: $saniValue  \n"
            }
        }
        form.on("end") {
            if (redirectTo?.isBlank() == false) {
                res.writeHead(302, json("location" to redirectTo)) as? Unit
            } else {
                res.json(json("status" to "success")) as? Unit
            }
            res.end()
            if (botTest) {
                sendMail(markdown = text, to = to, replyTo = replyTo, formName = formName)
            }
            addSubmissionToDB(formName, replyTo, text, if (botTest) 1 else 2)
        }
        form.parse(req)
    }

    private fun addSubmissionToDB(formName: String?, replyTo: String?, text: String?, sent: Int) {
        db.run("INSERT INTO submissions VALUES (NULL, ?, ?, ?, ?, ?)", arrayOf(Date.now(), formName, replyTo, text, sent)) { err ->
            if (err != null) console.log(err as Any)
        }
    }

    private fun sendMail(markdown: String, to: String?, replyTo: String?, formName: String?) {
        // Check if recipient is allowed
        var finalto = to
        if (Config.allowedTo != null) {
            val allowedToArray = Config.allowedTo?.split(" ")
            if (allowedToArray?.contains(to) != true) {
                console.log("Tried to send to $to, but that isn't allowed. Sending to ${Config.emailTo} instead.")
                finalto = Config.emailTo
            }
        }

        // Setup mail
        val mailOptions = json(
                "from" to Config.emailFrom,
                "to" to (finalto ?: Config.emailTo),
                "replyTo" to (replyTo ?: Config.emailFrom),
                "subject" to "New submission${if (!formName.isNullOrBlank()) "on $formName" else ""}",
                "markdown" to "**New submission:**  \n  \n$markdown"
        )

        // Send mail
        transporter.sendMail(mailOptions) { error, _ ->
            if (error != null) console.log(error as Any)
        }
    }

}
