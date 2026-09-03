package com.kuikly.personal.data

import com.tencent.kuikly.core.base.Color
import com.kuikly.personal.theme.Tokens

// =============================================================================
//  站点内容数据源
//
//  ★ 这是全站唯一需要你修改内容的文件 ★
//  下面全部是占位示例内容，替换成你自己的信息即可，页面无需改动。
// =============================================================================

/** 站点六大板块 */
enum class Section(
    val id: String,
    val title: String,
    /** 用字符代替图标资源，避免引入图片依赖，跨端零成本 */
    val glyph: String,
) {
    Home("home", "首页概览", "◎"),
    About("about", "关于我", "☺"),
    Works("works", "作品集", "◈"),
    Skills("skills", "技能栈", "⬢"),
    Blog("blog", "博客", "✎"),
    Contact("contact", "联系方式", "✉"),
    ;

    companion object {
        fun fromId(id: String): Section = entries.firstOrNull { it.id == id } ?: Home
    }
}

/** 概览统计数字 */
data class Stat(val value: String, val label: String, val glyph: String)

/** 经历时间线 */
data class TimelineItem(val period: String, val title: String, val org: String, val desc: String)

/** 单项技能，level 取值 0–100 */
data class Skill(val name: String, val level: Int)

/** 技能分组 */
data class SkillGroup(val group: String, val glyph: String, val items: List<Skill>)

/** 作品 */
data class Work(
    val title: String,
    val subtitle: String,
    val desc: String,
    val year: String,
    val tags: List<String>,
    /** 卡片占位色（真实项目里替换成封面图） */
    val tint: Color,
    val tintSoft: Color,
)

/** 博客文章 */
data class Post(
    val title: String,
    val date: String,
    val tag: String,
    val summary: String,
    val readMinutes: Int,
)

/** 联系方式 */
data class Contact(val label: String, val value: String, val glyph: String)

/** 站点全部内容 */
object SiteDataSource {

    // ------------------------------------------------------------------
    // 基本信息
    // ------------------------------------------------------------------
    const val NAME = "林深"
    const val TITLE = "跨端工程师 · Kotlin Multiplatform"
    const val LOCATION = "中国 · 深圳"
    /** 用文字首字 + 渐变底做头像，避免依赖图片资源 */
    const val AVATAR_TEXT = "林"
    const val STATUS = "● 目前可接受新的合作"

    /** 一句话简介（首页 Hero 区） */
    const val TAGLINE = "用一套代码，把同一种手感带到五块屏幕上。"

    /** 首页 Hero 下方的一段话 */
    const val HERO_DESC =
        "我做跨端开发，关心的不只是「能不能跑」，还有「摸起来对不对」。\n" +
            "这个站点本身就是一次实验：把物理世界的按压感，用阴影翻译成看得见的反馈。"

    // ------------------------------------------------------------------
    // 关于我
    // ------------------------------------------------------------------
    val BIO: List<String> = listOf(
        "我是林深，一名把「手感」当成正经事来做的跨端工程师。目前主要用 Kotlin Multiplatform 与 Kuikly 做一套代码多端交付，覆盖 Android、iOS、鸿蒙、Web 与小程序。",
        "早些年我做原生 Android，后来被跨端方案吸引——不是因为省事，而是因为「一致性」本身就是一种用户体验。同一个按钮，在五块屏幕上应该有同样的按压反馈，这件事值得认真对待。",
        "工作之外，我喜欢研究材质与光影的表现方式，也写一点关于渲染管线和布局算法的笔记。如果你也在意这些细节，欢迎聊聊。",
    )

    /** 工作经历 / 教育时间线 */
    val TIMELINE: List<TimelineItem> = listOf(
        TimelineItem("2023 — 至今", "高级跨端工程师", "某科技公司 · 大前端团队", "负责跨端框架的渲染层与组件库建设，支撑多条业务线一套代码五端交付。"),
        TimelineItem("2020 — 2023", "Android 工程师", "某互联网公司 · 客户端团队", "主导多个业务模块的架构重构，把启动耗时与内存峰值压到原来的一半。"),
        TimelineItem("2016 — 2020", "计算机科学 · 学士", "某大学", "在校期间做过图像处理与可视化方向的研究，从此对光影表现产生兴趣。"),
    )

    // ------------------------------------------------------------------
    // 首页概览统计
    // ------------------------------------------------------------------
    val STATS: List<Stat> = listOf(
        Stat("8 年", "从业经验", "⏱"),
        Stat("5 端", "一套代码覆盖", "◫"),
        Stat("30+", "开源贡献", "✦"),
        Stat("12k", "文章阅读量", "◉"),
    )

    // ------------------------------------------------------------------
    // 技能栈
    // ------------------------------------------------------------------
    val SKILL_GROUPS: List<SkillGroup> = listOf(
        SkillGroup("跨端与框架", "◫", listOf(
            Skill("Kotlin Multiplatform", 92),
            Skill("Kuikly", 88),
            Skill("Compose Multiplatform", 80),
            Skill("React Native", 62),
        )),
        SkillGroup("原生平台", "▣", listOf(
            Skill("Android / Kotlin", 90),
            Skill("iOS / Swift", 74),
            Skill("HarmonyOS / ArkTS", 70),
            Skill("Web / TypeScript", 78),
        )),
        SkillGroup("工程与工具", "⚙", listOf(
            Skill("Gradle / KSP", 85),
            Skill("CI / CD", 76),
            Skill("性能优化", 84),
            Skill("渲染与布局", 80),
        )),
    )

    // ------------------------------------------------------------------
    // 作品集
    // ------------------------------------------------------------------
    val WORKS: List<Work> = listOf(
        Work(
            title = "触感组件库 Haptic UI",
            subtitle = "开源 · 跨端组件库",
            desc = "把物理按压感做成一套可配置的设计令牌：阴影高度、下沉位移、缩放系数全部参数化，五端表现一致。",
            year = "2025",
            tags = listOf("Kuikly", "设计系统", "开源"),
            tint = Tokens.primary,
            tintSoft = Tokens.primarySoft,
        ),
        Work(
            title = "多端渲染调试器",
            subtitle = "效率工具",
            desc = "实时查看跨端视图树与布局边界，支持同时连五台设备对比渲染结果，定位平台差异问题。",
            year = "2024",
            tags = listOf("工具", "开发者体验"),
            tint = Tokens.accent,
            tintSoft = Tokens.accentSoft,
        ),
        Work(
            title = "跨端商城模板",
            subtitle = "业务脚手架",
            desc = "一套完整的多端商城脚手架，包含路由、状态管理、图片缓存与埋点，新业务接入平均节省三周。",
            year = "2024",
            tags = listOf("模板", "工程化"),
            tint = Tokens.success,
            tintSoft = Tokens.successSoft,
        ),
        Work(
            title = "光影可视化笔记",
            subtitle = "个人项目",
            desc = "用可视化方式拆解常见 UI 动效背后的物理规律，包含阴影、缓动、材质反射等十二个主题。",
            year = "2023",
            tags = listOf("可视化", "写作"),
            tint = Tokens.warning,
            tintSoft = Tokens.warningSoft,
        ),
    )

    // ------------------------------------------------------------------
    // 博客
    // ------------------------------------------------------------------
    val POSTS: List<Post> = listOf(
        Post(
            title = "用阴影表达按压：一套可落地的跨端方案",
            date = "2026-07-18",
            tag = "设计系统",
            summary = "按压反馈不是加个透明度就完事了。这篇文章拆解了阴影高度、下沉位移与缩放三者如何配合，才能让人「感觉」到按下去。",
            readMinutes = 12,
        ),
        Post(
            title = "Kotlin Multiplatform 在五端的产物差异",
            date = "2026-05-02",
            tag = "跨端",
            summary = "同一个 commonMain 编译到 aar、framework、so、js 之后，到底哪些能力会丢失？一次踩坑记录。",
            readMinutes = 18,
        ),
        Post(
            title = "为什么我把响应式断点放在页面层而不是样式层",
            date = "2026-03-11",
            tag = "布局",
            summary = "断点不只是改宽度。手机、平板、PC 的差异本质上是交互形态的差异，应该由布局层统一裁决。",
            readMinutes = 9,
        ),
        Post(
            title = "鸿蒙端适配：那些文档里没写的事",
            date = "2025-12-20",
            tag = "鸿蒙",
            summary = "从 ArkTS 到 Kotlin，鸿蒙端的渲染管线有不少隐晦差异，这里记录六个真实的适配问题。",
            readMinutes = 15,
        ),
    )

    // ------------------------------------------------------------------
    // 联系方式
    // ------------------------------------------------------------------
    val CONTACTS: List<Contact> = listOf(
        Contact("邮箱", "hello@example.com", "✉"),
        Contact("GitHub", "github.com/example", "◍"),
        Contact("微信", "example_wechat", "◉"),
        Contact("城市", "中国 · 深圳", "⌂"),
    )
}
