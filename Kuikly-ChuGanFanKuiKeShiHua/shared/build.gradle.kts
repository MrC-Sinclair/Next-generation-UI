import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpack

plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
    id("com.tencent.kuikly-open.kuikly")
}

group = "com.kuikly.personal"
version = "1.0.0"

// Kuikly 版本号规则：${框架版本}-${Kotlin 版本}
val kuiklyVersion = "2.26.0-2.1.21"

kotlin {
    // ---------- Web / H5（H5-only，仅保留 JS 目标） ----------
    js(IR) {
        // 业务产物模块名，必须与 kuikly { js { outputName(...) } } 保持一致
        moduleName = "nativevue2"
        browser {
            webpackTask {
                outputFileName = "nativevue2.js"
            }
            commonWebpackConfig {
                // 不导出全局对象，只导出必要的入口函数
                output?.library = null
            }
        }
        // 把 kotlin.js 与业务代码打包成一份可直接运行的 js
        binaries.executable()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.tencent.kuikly-open:core:$kuiklyVersion")
                implementation("com.tencent.kuikly-open:core-annotations:$kuiklyVersion")
            }
        }

        // Web 渲染器不加在这里，只加在 :h5App（Web 宿主）里，
        // H5-only 后 shared 仅保留 JS 目标产物。
        val jsMain by getting
    }
}

// KSP：处理 @Page 注解，生成页面注册表（H5-only，仅 JS 目标）
dependencies {
    add("kspJs", "com.tencent.kuikly-open:core-ksp:$kuiklyVersion")
}

// Kuikly 产物配置
kuikly {
    js {
        // 构建产物名，与 KMM 插件 webpackTask#outputFileName 一致
        outputName("nativevue2")
    }
}
