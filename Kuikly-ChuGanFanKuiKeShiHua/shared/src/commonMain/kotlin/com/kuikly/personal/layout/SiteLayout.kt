package com.kuikly.personal.layout

import com.tencent.kuikly.core.pager.Pager

/**
 * 响应式形态：一套代码适配 PC 不同尺寸 / 平板 / 手机。
 */
enum class FormFactor {
    /** 手机：Android / iOS / 鸿蒙 / 小程序 竖屏 */
    Phone,
    /** 平板 / 小窗口 PC */
    Tablet,
    /** PC 宽屏 */
    Desktop,
}

/**
 * 由页面宽度推导出的布局参数。
 *
 * 用法：在 body() 里读取 pager.pageData.pageViewWidth 构造。
 * pageViewWidth 是响应式字段，窗口尺寸变化（PC 拖窗口、手机横竖屏切换）时
 * Web 渲染器会自动透传新尺寸，页面随之重算布局。
 */
class SiteLayout(width: Float) {

    val formFactor: FormFactor = when {
        width >= 1024f -> FormFactor.Desktop
        width >= 640f -> FormFactor.Tablet
        else -> FormFactor.Phone
    }

    val isDesktop: Boolean get() = formFactor == FormFactor.Desktop
    val isPhone: Boolean get() = formFactor == FormFactor.Phone

    /** 侧边导航宽度（仅 Desktop 使用） */
    val sideNavWidth: Float = when (formFactor) {
        FormFactor.Desktop -> 252f
        FormFactor.Tablet -> 76f
        FormFactor.Phone -> 0f
    }

    /** 底部 Tab 栏高度（仅 Phone 使用） */
    val bottomBarHeight: Float = if (isPhone) 60f else 0f

    /** 顶部标题栏高度 */
    val topBarHeight: Float = when (formFactor) {
        FormFactor.Desktop -> 0f // PC 用侧边导航，不需要顶栏
        FormFactor.Tablet -> 56f
        FormFactor.Phone -> 52f
    }

    /** 内容区左右留白 */
    val gutter: Float = when (formFactor) {
        FormFactor.Desktop -> 40f
        FormFactor.Tablet -> 28f
        FormFactor.Phone -> 16f
    }

    /** 内容区上下留白 */
    val verticalPadding: Float = when (formFactor) {
        FormFactor.Desktop -> 36f
        FormFactor.Tablet -> 24f
        FormFactor.Phone -> 16f
    }

    /**
     * 内容区最大宽度。
     * PC 上限制上限，避免 4K 屏下正文被拉成一条超长直线影响阅读。
     */
    val contentMaxWidth: Float = when (formFactor) {
        FormFactor.Desktop -> 1080f
        FormFactor.Tablet -> 900f
        FormFactor.Phone -> width
    }

    /** 卡片网格列数 */
    val gridColumns: Int = when (formFactor) {
        FormFactor.Desktop -> 3
        FormFactor.Tablet -> 2
        FormFactor.Phone -> 1
    }

    /** 概览区统计卡列数 */
    val statColumns: Int = when (formFactor) {
        FormFactor.Desktop -> 4
        FormFactor.Tablet -> 2
        FormFactor.Phone -> 2
    }

    /**
     * Hero 文案列宽（仅 Desktop 横排布局用）。
     *
     * 不用 flex(1f) 的原因：Kuikly H5 渲染器在 flex(1f) + 嵌套 column + Text
     * 的组合下，会把子 Text 的可用宽度算成很小（接近 1 字符），导致按字符换行。
     * 显式给一个合理宽度就稳了。
     */
    val heroCopyWidth: Float get() = (contentMaxWidth - 200f).coerceAtLeast(0f)
}

/**
 * 便捷取值：当前页面的布局参数。
 */
fun Pager.siteLayout(): SiteLayout = SiteLayout(pageData.pageViewWidth)
