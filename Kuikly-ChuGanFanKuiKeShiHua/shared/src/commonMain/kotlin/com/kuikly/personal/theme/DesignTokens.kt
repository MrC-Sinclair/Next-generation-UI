package com.kuikly.personal.theme

import com.tencent.kuikly.core.base.Color

/**
 * 设计令牌 —— 浅色 · 拟物微光影
 *
 * 配色思路：页面底色比卡片更低一档（#EEF0F4 vs #FFFFFF），
 * 这样卡片才能"浮"在页面上，投影才有意义。
 * 如果页面和卡片同色，再大的阴影也看不出层次。
 */
object Tokens {

    // ------------------------------------------------------------------
    // 背景
    // ------------------------------------------------------------------
    /** 页面底色（桌面） */
    val bgPage = Color(0xFFEEF0F4)
    /** 卡片表面（浮起物） */
    val bgSurface = Color(0xFFFFFFFF)
    /** 卡片被按下后的"沉入"底色，比 surface 暗一档 */
    val bgSunken = Color(0xFFE8EBF2)
    /** 次级浅底，用于标签、代码块 */
    val bgSubtle = Color(0xFFF5F7FA)

    // ------------------------------------------------------------------
    // 主色
    // ------------------------------------------------------------------
    val primary = Color(0xFF2F5CFF)
    val primaryStrong = Color(0xFF1B3FD6)
    val primarySoft = Color(0xFFE9EEFF)

    // ------------------------------------------------------------------
    // 强调色（暖橙，与主色形成冷暖对比）
    // ------------------------------------------------------------------
    val accent = Color(0xFFFF7A45)
    val accentSoft = Color(0xFFFFEFE8)

    // ------------------------------------------------------------------
    // 文字
    // ------------------------------------------------------------------
    val textPrimary = Color(0xFF14171F)
    val textSecondary = Color(0xFF5B6472)
    val textTertiary = Color(0xFF98A1B0)
    val textOnPrimary = Color(0xFFFFFFFF)

    // ------------------------------------------------------------------
    // 线条 / 分隔
    // ------------------------------------------------------------------
    val divider = Color(0xFFE6E9F0)
    val dividerStrong = Color(0xFFD5DAE4)

    // ------------------------------------------------------------------
    // 语义色
    // ------------------------------------------------------------------
    val success = Color(0xFF16A34A)
    val successSoft = Color(0xFFE6F6EC)
    /** 深一档的成功色，专用于软底上的文字，保证对比度 */
    val successDeep = Color(0xFF15803D)
    val warning = Color(0xFFF59E0B)
    val warningSoft = Color(0xFFFEF4E3)

    // ------------------------------------------------------------------
    // 间距（dp）
    // ------------------------------------------------------------------
    object Space {
        const val xxs = 4f
        const val xs = 8f
        const val sm = 12f
        const val md = 16f
        const val lg = 24f
        const val xl = 32f
        const val xxl = 48f
    }

    // ------------------------------------------------------------------
    // 圆角（dp）
    // ------------------------------------------------------------------
    object Radius {
        const val sm = 12f
        const val md = 16f
        const val lg = 22f
        const val xl = 28f
        /** 胶囊形，用于标签 / 按钮 */
        const val pill = 999f
    }

    // ------------------------------------------------------------------
    // 字号（dp）
    //
    // 注意：H5 渲染器内部会把 fontSize 乘上 pageData.density（Web 上约为
    // window.devicePixelRatio），导致最终 CSS 字号 ≈ token × 3。所以这里
    // 的"期望 CSS 像素"值要先除以 3，比如想让最终显示 26px，token 写 9。
    // 这样的 token 看起来很小，但渲染出的视觉字号是正常的。
    // ------------------------------------------------------------------
    object Type {
        /** 大标题（Hero） */
        const val display = 34f
        const val h1 = 26f
        const val h2 = 20f
        const val h3 = 16f
        /** 正文 */
        const val body = 14f
        const val bodyLarge = 15f
        const val caption = 12f
        const val micro = 10f
    }
}
