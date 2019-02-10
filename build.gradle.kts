import org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile

group = "maily-form"
version = "1.0"

buildscript {
    var kotlinVersion: String by extra
    kotlinVersion = "1.3.21"
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
    dependencies {
        classpath(kotlin("gradle-plugin", kotlinVersion))
    }
}

val kotlinVersion: String by extra

apply {
    plugin("kotlin2js")
}

repositories {
    mavenCentral()
}

dependencies {
    "compile"(kotlin("stdlib-js", kotlinVersion))
}

val compileKotlin2Js by tasks.getting(Kotlin2JsCompile::class) {
    kotlinOptions.outputFile = "$projectDir/app/index.js"
    kotlinOptions.moduleKind = "commonjs"
}
