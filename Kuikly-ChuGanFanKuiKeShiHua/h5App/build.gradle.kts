import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Paths

plugins {
    // Kotlin Multiplatform：Web / H5 宿主壳只打 JS 目标
    kotlin("multiplatform")
}

// 与根 gradle.properties 保持一致的 Kuikly 版本（格式：框架版本-Kotlin 版本）
val kuiklyVersion: String = (project.findProperty("KUIKLY_VERSION") as? String) ?: "2.26.0-2.1.21"

// 业务模块名（shared/src/commonMain 编译出的业务 JS Bundle 在 shared 模块内）
val businessPathName = "shared"

kotlin {
    // Build JS output for h5App
    js(IR) {
        // Build output supports browser
        browser {
            webpackTask {
                // Final output executable JS filename
                outputFileName = "h5App.js"
            }

            commonWebpackConfig {
                // Do not export global objects, only export necessary entry methods
                output?.library = null
            }
        }
        // Package render code and h5App code together and execute directly
        binaries.executable()
    }
    sourceSets {
        val jsMain by getting {
            dependencies {
                // Kuikly Web 渲染器：base（核心渲染）+ h5（H5 宿主扩展）。
                // 使用 Maven 制品而非官方仓库的 project(":core-render-web:*") 项目依赖。
                implementation("com.tencent.kuikly-open.core-render-web:base:$kuiklyVersion")
                implementation("com.tencent.kuikly-open.core-render-web:h5:$kuiklyVersion")
            }
        }
    }
}

// ---------------------------------------------------------------------------
// 以下任务逻辑与官方 Kuikly h5App 模板一致：
// 1) publishLocalJSBundle —— 编译宿主 h5App.js，并把业务模块的 nativevue2.js
//    从 shared 的本地 JS Bundle（zip）解压合并进生产产物目录
// 2) buildSite —— 本仓库 README 对外承诺的任务：把可直接托管的静态站点
//    汇总到 h5App/build/site/（index.html / h5App.js / page/nativevue2.js）
// ---------------------------------------------------------------------------

/**
 * Copy locally built unified JS result to h5App's build directory page subfolder
 */
fun copyLocalJSBundle(buildSubPath: String) {
    // Output target path
    val destDir = Paths.get(project.buildDir.absolutePath,
        buildSubPath, "page").toFile()
    if (!destDir.exists()) {
        // Create directory if it doesn't exist
        destDir.mkdirs()
    } else {
        // Remove original files if directory exists
        destDir.deleteRecursively()
    }

    // Input target path, will be filled by decompressing the business zip below
    val sourceDir = Paths.get(project.buildDir.absolutePath, buildSubPath, "kotlin2js").toFile()

    // File to be decompressed (business module's unified JS bundle)
    val zipFile = Paths.get(
        project.rootDir.absolutePath,
        businessPathName,
        "build", "outputs", "kuikly", "js", "release", "local", "nativevue2.zip"
    ).toFile()
    if (!zipFile.exists()) {
        throw GradleException("找不到业务模块 JS Bundle：${zipFile.absolutePath}。请先执行 ./gradlew :shared:packLocalJSBundleRelease")
    }
    // Compressed file directory
    val zipDir = Paths.get(project.buildDir.absolutePath, buildSubPath, "kotlin2js").toFile()
    if (!zipDir.exists()) {
        zipDir.mkdirs()
    } else {
        zipDir.deleteRecursively()
    }
    // Decompress
    project.copy {
        from(zipTree(zipFile))
        into(zipDir)
    }
    // Copy business bundle js files from decompressed result
    project.copy {
        from(sourceDir) {
            include("nativevue2.js")
        }
        into(destDir)
    }
    // Remove redundant decompressed directory kotlin2js
    delete(sourceDir)
}

/**
 * Copy business assets resources into h5App's production directory
 */
fun copyAssetsResource(buildSubPath: String) {
    val sourceDir = Paths.get(
        project.rootDir.absolutePath,
        businessPathName,
        "build", "outputs", "kuikly", "assets"
    )
    if (!sourceDir.toFile().exists()) {
        // Business has no assets, skip silently
        return
    }
    val destDir = Paths.get(
        project.rootDir.absolutePath,
        project.name,
        "build", buildSubPath, "assets"
    )
    project.copy {
        from(sourceDir)
        into(destDir)
    }
}

/**
 * Rewrite development JS bundle URL in index.html to the production relative path
 */
fun generateLocalHtml(buildSubPath: String) {
    val filePath = Paths.get(project.buildDir.absolutePath,
        buildSubPath, "index.html")
    if (Files.exists(filePath)) {
        val fileContent = Files.readString(filePath)
        // Placeholder written by the official template for dev server
        val placeText = "http://127.0.0.1:8083/nativevue2.js"
        val updatedContent = fileContent.replace(placeText, "page/nativevue2.js")
        Files.writeString(filePath, updatedContent, StandardCharsets.UTF_8)
        println("generate local html file success: $filePath")
    }
}

/**
 * Locate the real production executable directory.
 * Kotlin 2.0+ webpack output lives under build/kotlin-webpack/js/productionExecutable;
 * some setups also keep the old build/dist/js/productionExecutable layout.
 */
fun findProductionExecutableDir(): File {
    // publishLocalJSBundle 将合并后的 index.html/h5App.js/page/nativevue2.js 写入 dist 布局，
    // 优先取它作为可直接托管的站点源；kotlin-webpack 仅为未合并的原始 webpack 输出。
    val candidates = listOf(
        Paths.get(project.buildDir.absolutePath, "dist", "js", "productionExecutable").toFile(),
        Paths.get(project.buildDir.absolutePath, "kotlin-webpack", "js", "productionExecutable").toFile(),
    )
    return candidates.firstOrNull { it.isDirectory }
        ?: error("找不到 h5App 生产产物目录，请确认 publishLocalJSBundle 已成功执行")
}

project.afterEvaluate {
    // Register Release unified packaging task (official kuikly flow)
    tasks.register("publishLocalJSBundle") {
        group = "kuikly"
        dependsOn("jsBrowserDistribution")

        doFirst {
            // Merge business module nativevue2.js from its zip into the h5App release dir
            copyLocalJSBundle("dist/js/productionExecutable")
            // Copy assets resources (empty-safe)
            copyAssetsResource("dist/js/productionExecutable")
        }

        doLast {
            // Point index.html to the production bundle
            generateLocalHtml("dist/js/productionExecutable")
        }
    }

    // Build a directly hostable static site under h5App/build/site
    tasks.register("buildSite") {
        group = "kuikly"
        // 1) Business module unified JS bundle (nativevue2.zip)
        dependsOn(":shared:packLocalJSBundleRelease")
        // 2) h5App host build + merge business bundle (index.html/h5App.js/page/nativevue2.js)
        dependsOn("publishLocalJSBundle")

        doLast {
            val prodDir = findProductionExecutableDir()
            val siteDir = Paths.get(project.buildDir.absolutePath, "site").toFile()
            if (siteDir.exists()) {
                siteDir.deleteRecursively()
            }
            siteDir.mkdirs()
            project.copy {
                from(prodDir)
                into(siteDir)
            }
            println("H5 静态站点产物：${siteDir.absolutePath}")
            println("预览命令：cd ${siteDir.absolutePath} && python -m http.server 8080")
        }
    }
}
