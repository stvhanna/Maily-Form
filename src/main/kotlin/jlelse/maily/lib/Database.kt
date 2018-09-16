package jlelse.maily.lib

import jlelse.maily.require

object Database {
    private val db = getDb(Config.database)

    init {
        create()
    }

    fun connect(): dynamic {
        return db
    }

    fun disconnect() {
        db.close()
    }

    private fun create() {
        db.run("CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, formName TEXT, replyTo TEXT, text TEXT, sent INTEGER)") { err ->
            if (err != null) console.log(err.message as? String)
            else console.log("Database initialized")
        }
    }

    private fun getDb(dbPath: String): dynamic {
        @Suppress("UNUSED_VARIABLE", "NAME_SHADOWING")
        val dbPath = dbPath
        @Suppress("UNUSED_VARIABLE")
        val sqlite = require("sqlite3").verbose()
        return js("new sqlite.Database(dbPath)")
    }

}
