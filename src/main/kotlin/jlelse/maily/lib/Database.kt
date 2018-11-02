package jlelse.maily.lib

import jlelse.maily.require
import kotlin.js.json

object Database {
    val db: dynamic = connect()

    private fun connect(): dynamic {
        try {
            val db = getDb(Config.database)
            createAndMigrate(db)
            return db
        } catch (err: Error) {
            console.log("Failed to connect to Database")
            throw err
        }
    }

    private fun createAndMigrate(db: dynamic) {
        val latestVersion = 1
        // Create Database if it doesn't exist yet
        val schemaVersion = db.pragma("schema_version", json("simple" to true)) as Int
        if (schemaVersion == 0) {
            console.log("Create Database")
            try {
                db.exec("CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, formName TEXT, replyTo TEXT, text TEXT, response TEXT, status INTEGER);PRAGMA user_version = $latestVersion;")
                console.log("Database created")
            } catch (e: Error) {
                console.log("Failed to create Database")
                throw e
            }
        } else {
            // Check and migrate Database
            val userVersion = db.pragma("user_version", json("simple" to true)) as Int
            console.log("Current DB version: $userVersion")
            var migrationStatement = ""
            // Version 1 changes sent to status and adds response text
            if (userVersion < 1) migrationStatement += """
                                ALTER TABLE submissions RENAME TO tmp_submissions;
                                CREATE TABLE submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, formName TEXT, replyTo TEXT, text TEXT, response TEXT, status INTEGER);
                                INSERT INTO submissions(id, time, formName, replyTo, text, status) SELECT id, time, formName, replyTo, text, sent FROM tmp_submissions;
                                DROP TABLE tmp_submissions;
                            """.trimIndent()
            if (!migrationStatement.isBlank()) {
                console.log("Migrating DB to latest version.")
                try {
                    db.exec("BEGIN TRANSACTION;${migrationStatement}PRAGMA user_version = $latestVersion;COMMIT;")
                    console.log("Migration finished.")
                } catch (e: Error) {
                    console.log("Failed to migrate Database")
                    throw e
                }
            }
        }
    }

    private fun getDb(dbPath: String): dynamic {
        val betterSqlite = require("better-sqlite3")
        return betterSqlite(dbPath)
    }

}
