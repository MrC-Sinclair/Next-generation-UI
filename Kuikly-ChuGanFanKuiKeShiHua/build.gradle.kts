// 根目录构建脚本：统一声明各 Gradle 插件版本与依赖仓库。
//
// Kuikly 相关制品（core / core-ksp / core-annotations / core-render-web / core-gradle-plugin）
// 均未发布到 Maven Central 的 com.tencent.kuikly 组，而是发布在
// com.tencent.kuikly-open 组：
//   - Maven Central  : 只有部分历史版本（最新仅到 2.4.2）
//   - 腾讯镜像仓库    : 与 GitHub Release 同步，当前最新 2.26.0
// 因此这里显式声明腾讯镜像仓库，否则会解析不到依赖。
buildscript {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://mirrors.tencent.com/repository/maven-tencent/") }
    }
    dependencies {
        classpath("com.tencent.kuikly-open:core-gradle-plugin:2.26.0-2.1.21")
    }
}

plugins {
    kotlin("multiplatform") version "2.1.21" apply false
    // com.android.application / com.android.library 原服务已删除的 Android 宿主与
    // shared 的 androidTarget（本轮已裁剪），H5-only 后不再需要 AGP，故不再声明
    id("com.google.devtools.ksp") version "2.1.21-2.0.1" apply false
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://mirrors.tencent.com/repository/maven-tencent/") }
    }
}

// ---------------------------------------------------------------------------
// Kotlin/JS 的 yarn 下载源
//
// Kotlin/JS 会先把 yarn 下载到本地，再用它安装 npm 依赖，默认地址是 GitHub Releases。
// 国内网络直连 GitHub 经常超时，所以允许通过 gradle.properties 的
// yarnDownloadBaseUrl 覆盖下载地址（末尾斜杠不要丢）。
// ---------------------------------------------------------------------------
gradle.projectsEvaluated {
    val mirror = (project.findProperty("yarnDownloadBaseUrl") as? String)?.trim().orEmpty()
    if (mirror.isEmpty()) return@projectsEvaluated

    val yarnExtension =
        rootProject.extensions.findByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension::class.java)
    if (yarnExtension == null) {
        logger.warn("未找到 Kotlin/JS 的 yarn 扩展，跳过 yarn 下载源配置")
    } else {
        yarnExtension.downloadBaseUrl = mirror
        logger.lifecycle("yarn 下载源已切换为：$mirror")
    }
}

// ---------------------------------------------------------------------------
// npm 依赖镜像
//
// 光换 yarn 的下载源还不够：yarn 装 webpack / karma 这些 npm 包时默认走
// registry.yarnpkg.com，国内会慢到卡死（实测 20 分钟没进展）。
// 这里直接给 kotlinNpmInstall 任务注入 npm_config_registry 环境变量，
// 优先级高于 .yarnrc，保证一定生效。想改源就改 gradle.properties 的
// npmRegistry，或者把这一整段删掉（能直连外网时）。
// ---------------------------------------------------------------------------
gradle.projectsEvaluated {
    val npmMirror = (project.findProperty("npmRegistry") as? String)?.trim()
        ?.ifEmpty { null }
        ?: "https://registry.npmmirror.com"

    val npmInstallTasks = rootProject.tasks.matching { it.name == "kotlinNpmInstall" }
    if (npmInstallTasks.isEmpty()) {
        logger.warn("未找到 kotlinNpmInstall 任务，跳过 npm 镜像配置")
    } else {
        npmInstallTasks.configureEach {
            // 任务类型随 Kotlin 版本变化，这里做安全转型：
            // 只要它实现了 ExecSpec（能设环境变量）就注入，否则交给 .yarnrc 兜底
            (this as? org.gradle.process.ExecSpec)?.environment("npm_config_registry", npmMirror)
        }
        logger.lifecycle("npm 依赖源已切换为：$npmMirror")
    }
}
