package jlelse.maily.lib

import jlelse.maily.process

object Config {
    var nodeEnv: String? = process.env.NODE_ENV as? String
    var formName: String = "anonymous"
    var database: String = "data/submissions.db"
    // Admin credentials to access the dashboard
    var adminUsername: String? = null
    var adminPassword: String? = null
    var adminRealm: String = "Maily-Form Administration"
    // Parameters to send emails
    var smtpHost: String? = null
    var smtpPort: Int? = null
    var smtpUser: String? = null
    var smtpPass: String? = null
    var smtpSsl: Boolean = false
    var smtpAuth: Boolean = false
    // Header content for emails
    var emailFrom: String = "noreply@example.com"
    var emailTo: String = "noreply@example.com"
    // Text content for success and error messages
    var messageSuccess: String = "Thank you for your submission."
    var messageError: String = "Unable to send your submission."
    var subjectSuccess: String = "New submission from $formName"
    var subjectError: String = "Error in submission from $formName"
    // Allowed recipients
    var allowedTo: String? = null
    // Response format
    var responseFormat: String = "json"
    // Security
    var corsHeader: String = "*"
    // Server
    var host: String = "127.0.0.1"
    var port: Int = 8080

    init {
        if (nodeEnv == "production" || nodeEnv == "development") {
            adminUsername = process.env.ADMIN_USER as? String ?: adminUsername
            adminPassword = process.env.ADMIN_PASS as? String ?: adminPassword
            adminRealm = process.env.ADMIN_REALM as? String ?: adminRealm
            smtpHost = process.env.SMTP_HOST as? String ?: smtpHost
            smtpPort = (process.env.SMTP_PORT as? String)?.toIntOrNull() ?: smtpPort
            smtpUser = process.env.SMTP_USER as? String ?: smtpUser
            smtpPass = process.env.SMTP_PASS as? String ?: smtpPass
            smtpSsl = (process.env.SMTP_SSL as? String)?.toBoolean() ?: smtpSsl
            smtpAuth = (process.env.SMTP_AUTH as? String)?.toBoolean() ?: smtpAuth
            emailFrom = process.env.EMAIL_FROM as? String ?: emailFrom
            emailTo = process.env.EMAIL_TO as? String ?: emailTo
            messageSuccess = process.env.MESSAGE_SUCCESS as? String ?: messageSuccess
            messageError = process.env.MESSAGE_ERROR as? String ?: messageError
            subjectSuccess = process.env.SUBJECT_SUCCESS as? String ?: subjectSuccess
            subjectError = process.env.SUBJECT_ERROR as? String ?: subjectError
            allowedTo = process.env.ALLOWED_TO as? String ?: allowedTo
            responseFormat = process.env.RESPONSE_FORMAT as? String ?: responseFormat
            corsHeader = process.env.CORS_HEADER as? String ?: corsHeader
            host = process.env.HOST as? String ?: host
            port = (process.env.PORT as? String)?.toIntOrNull() ?: port
        } else { // Test
            database = "data/submissions-test.db"
            adminUsername = "admin"
            adminPassword = "admin"
            smtpHost = "localhost"
            smtpPort = 1025
        }
    }
}
