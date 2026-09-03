pluginManagement {
    repositories {
        google()
        gradlePluginPortal()
        mavenCentral()
        maven { url = uri("https://mirrors.tencent.com/repository/maven-tencent/") }
        maven { url = uri("https://mirrors.tencent.com/nexus/repository/gradle-plugins/") }
    }
}

rootProject.name = "ChuGanFanKuiKeShiHua"
rootProject.buildFileName = "build.gradle.kts"

// 站点业务模块：全平台共享的站点代码（页面 / 设计系统 / 数据源）
include(":shared")

// Web / H5 宿主壳工程：把 :shared 与 Web 渲染器链接成一份 h5App.js
include(":h5App")

// 已收窄为 H5-only：androidApp / miniApp / iosApp 宿主端已移除，
// 仅保留 :shared（站点业务模块）与 :h5App（Web 宿主壳工程）。
