package com.kuikly.personal.theme

import com.tencent.kuikly.core.base.Attr
import com.tencent.kuikly.core.base.BoxShadow
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.Scale
import com.tencent.kuikly.core.base.Translate

/**
 * 触感反馈可视化的核心：把"物理按压"翻译成阴影与位移的变化。
 *
 * 物理直觉
 * --------
 * 现实中一个物体离桌面越高：投影越大、越模糊、越淡；
 * 手指按下去时：物体贴近桌面，投影迅速收紧、变小、变实，
 * 同时物体本身轻微下沉并缩小一点点（模拟被压扁）。
 *
 * 所以一个可按压元素有三种"高度状态"：
 *   REST    浮起  —— 大 offsetY + 大 blur + 低透明度
 *   HOVER   抬升  —— 比 REST 更高一档（仅 PC 鼠标悬停时出现）
 *   PRESSED 压平  —— offsetY / blur 收缩到极小 + 元素下沉 + 轻微缩小
 *
 * 注意：三档之间只改 offsetY / blur / alpha，色相保持一致，
 * 否则会变成"变色"而不是"按压"。
 */
enum class Elevation(
    /** 静止：浮起状态 */
    val rest: BoxShadow,
    /** 悬停：抬升状态（PC） */
    val hover: BoxShadow,
    /** 按下：压平状态 */
    val pressed: BoxShadow,
    /** 按下时向下位移的 dp 数 */
    val sinkDp: Float,
    /** 按下时的缩放系数 */
    val pressedScale: Float,
) {
    /** 低高度：标签、小按钮。按下几乎贴平桌面。 */
    Low(
        rest = shadow(2f, 6f, 0x1A),
        hover = shadow(3f, 10f, 0x22),
        pressed = shadow(0f, 1f, 0x33),
        sinkDp = 1f,
        pressedScale = 0.985f,
    ),

    /** 中高度：常规卡片。最常用的档位。 */
    Medium(
        rest = shadow(5f, 14f, 0x17),
        hover = shadow(8f, 22f, 0x20),
        pressed = shadow(1f, 3f, 0x30),
        sinkDp = 2f,
        pressedScale = 0.975f,
    ),

    /** 高高度：主行动按钮、悬浮元素。 */
    High(
        rest = shadow(8f, 22f, 0x18),
        hover = shadow(12f, 30f, 0x22),
        pressed = shadow(1f, 4f, 0x33),
        sinkDp = 3f,
        pressedScale = 0.97f,
    ),

    /** 悬浮：Hero 头像、置顶卡片。 */
    Floating(
        rest = shadow(12f, 32f, 0x16),
        hover = shadow(16f, 40f, 0x1E),
        pressed = shadow(2f, 6f, 0x2E),
        sinkDp = 4f,
        pressedScale = 0.965f,
    ),
}

/**
 * 构造阴影。
 *
 * 写成顶层私有函数而不是伴生对象里的成员：Kotlin 的枚举常量初始化时
 * 伴生对象还没就绪，从枚举参数里调用 companion 方法会编译报错。
 *
 * 阴影统一用同一支冷调黑（0B1220），只调 alpha 与几何，保证跨端观感一致。
 */
private fun shadow(offsetY: Float, blur: Float, alphaHex: Int): BoxShadow =
    BoxShadow(0f, offsetY, blur, Color((alphaHex shl 24).toLong() or 0x0B1220L))

/**
 * 按压状态。移动端只有 IDLE / PRESSED；PC 端鼠标悬停会额外进入 HOVER。
 */
enum class PressState {
    Idle, Hover, Pressed
}

/**
 * 把按压状态应用到任意视图的属性上。
 *
 * 这是整个设计语言唯一的"动效出口"：所有可按压元素都必须经过这里，
 * 以保证全站按压感一致。
 */
fun Attr.applyElevation(
    elevation: Elevation,
    pressState: PressState,
    /** 基底色：按下时会换成对应的沉入色 */
    surfaceColor: Color,
    sunkenColor: Color,
    /** 是否参与位移/缩放（悬浮大卡片可关闭，避免抖动过猛） */
    enableTransform: Boolean = true,
) {
    boxShadow(
        when (pressState) {
            PressState.Pressed -> elevation.pressed
            PressState.Hover -> elevation.hover
            PressState.Idle -> elevation.rest
        }
    )
    backgroundColor(if (pressState == PressState.Pressed) sunkenColor else surfaceColor)

    if (enableTransform) {
        if (pressState == PressState.Pressed) {
            transform(
                scale = Scale(elevation.pressedScale, elevation.pressedScale),
                translate = Translate(0f, 0f, 0f, elevation.sinkDp),
            )
        } else {
            transform(
                scale = Scale(1f, 1f),
                translate = Translate(0f, 0f, 0f, 0f),
            )
        }
    }
}
