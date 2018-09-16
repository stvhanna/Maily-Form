package jlelse.maily

import jlelse.maily.Server.app
import jlelse.maily.lib.Config

fun main(args: Array<String>) {
    var server: dynamic = null
    server = app.listen(Config.port, Config.host) {
        console.log("Server ready on ${server.address().address}:${server.address().port}")
    }
}

fun testServer() = "Hello kotlin"

external fun require(module: String): dynamic
external var process: dynamic
