package jlelse.maily

import jlelse.maily.lib.Config
import jlelse.maily.routes.Api
import jlelse.maily.routes.Forms
import kotlin.js.json

object Server {
    private val express = require("express")
    private val cors = require("cors")
    private val errorHandler = require("errorhandler")
    private val auth = require("http-auth")

    val app = express()

    init {
        if (Config.nodeEnv == "development") {
            app.use(errorHandler(json("dumpExceptions" to true, "showStack" to true)))
        } else {
            app.use(errorHandler())
        }

        app.use(express.json())
        app.use(cors(json("origin" to Config.corsHeader)))
        app.use(express.static("public"))

        app.use("/", Forms.router)

        if (!Config.adminUsername.isNullOrBlank() && !Config.adminPassword.isNullOrBlank()) {
            val basicAuth = auth.basic(json("realm" to Config.adminRealm)) { username, password, callback ->
                callback(username == Config.adminUsername && password == Config.adminPassword)
            }

            app.use("/api", auth.connect(basicAuth), Api.router)
            app.use("/admin", auth.connect(basicAuth), express.static("admin/dist"))
        }
    }
}
