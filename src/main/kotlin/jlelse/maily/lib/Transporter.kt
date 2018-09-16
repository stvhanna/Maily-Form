package jlelse.maily.lib

import jlelse.maily.require
import kotlin.js.json

object Transporter {
    private val nodemailer = require("nodemailer")
    private val markdown = require("nodemailer-markdown").markdown

    private val transporterConfig = json(
            "host" to Config.smtpHost,
            "port" to Config.smtpPort,
            "secure" to Config.smtpSsl,
            "auth" to if (Config.smtpAuth && Config.smtpUser != null && Config.smtpPass != null) {
                json(
                        "user" to Config.smtpUser,
                        "pass" to Config.smtpPass
                )
            } else false,
            "tls" to json(
                    "rejectUnauthorized" to Config.smtpSsl
            )
    )
    val transporter: dynamic = nodemailer.createTransport(transporterConfig)

    init {
        console.log(transporterConfig)
        transporter.use("compile", markdown())
    }
}
