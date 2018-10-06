package jlelse.maily.lib

import jlelse.maily.require

object Database {
    private val db = getDb(Config.database)

    init {
        createAndMigrate()
    }

    fun connect(): dynamic {
        return db
    }

    fun disconnect() {
        db.close()
    }

    private fun createAndMigrate() {
        val latestVersion = 1
        // Create Database if it doesn't exist yet
        db.get("PRAGMA schema_version") { err, row ->
            if (err != null) console.log(err.message as? String)
            else {
                val schemaVersion = row.schema_version
                if (schemaVersion == 0) {
                    console.log("Create Database")
                    db.exec("CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, formName TEXT, replyTo TEXT, text TEXT, response TEXT, status INTEGER);PRAGMA user_version = $latestVersion;") { err2 ->
                        if (err2 != null) console.log(err2.message as? String)
                        else console.log("Database created")
                    }
                } else {
                    db.get("PRAGMA user_version") { err2, row2 ->
                        if (err2 != null) console.log(err2.message as? String)
                        else {
                            // Check and migrate Database
                            val userVersion = row2.user_version
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
                                db.exec("BEGIN TRANSACTION;${migrationStatement}PRAGMA user_version = $latestVersion;COMMIT;") { err3 ->
                                    if (err3 != null) console.log(err3.message as? String)
                                    else console.log("Migration finished.")
                                }
                            }
                        }
                    }
                }
            }
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
