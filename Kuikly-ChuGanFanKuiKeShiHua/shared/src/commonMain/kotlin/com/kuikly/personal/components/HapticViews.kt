package com.kuikly.personal.components

import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.kuikly.personal.pages.SitePage
import com.kuikly.personal.theme.Elevation
import com.kuikly.personal.theme.PressState
import com.kuikly.personal.theme.Tokens
import com.kuikly.personal.theme.applyElevation

// =============================================================================
//  触感反馈可视化组件
//
//  全站所有"可按压"元素都必须经过 hapticSurface()，
//  这样按压手感（阴影收紧 + 下沉 + 微缩 + 底色变暗）才能保持一致。
//
//  实现要点：按压状态存在页面级（page.pressStateOf(key)），
//  在 attr {} 块内读取。Kuikly 的 attr 块是响应式的，
//  状态变化时会自动重算该块，不需要重建视图树。
// =============================================================================

/**
 * 通用可按压容器。
 *
 * @param page   持有全站按压状态的页面
 * @param key    元素唯一标识，用来判断"当前被按下的是不是我"
 * @param elevation 阴影高度档位
 */
internal fun ViewContainer<*, *>.hapticSurface(
    page: SitePage,
    key: String,
    elevation: Elevation = Elevation.Medium,
    surfaceColor: Color = Tokens.bgSurface,
    hoverColor: Color = surfaceColor,
    sunkenColor: Color = Tokens.bgSunken,
    radius: Float = Tokens.Radius.md,
    innerPadding: Float = Tokens.Space.md,
    marginTop: Float = 0f,
    marginBottom: Float = 0f,
    marginLeft: Float = 0f,
    marginRight: Float = 0f,
    flexWeight: Float? = null,
    fixedHeight: Float? = null,
    onTap: (() -> Unit)? = null,
    content: ViewContainer<*, *>.() -> Unit,
) {
    View {
        attr {
            val pressState = page.pressStateOf(key)

            flexDirectionColumn()
            borderRadius(radius)
            if (innerPadding > 0f) padding(innerPadding)
            if (marginTop != 0f || marginBottom != 0f || marginLeft != 0f || marginRight != 0f) {
                margin(marginTop, marginLeft, marginBottom, marginRight)
            }
            flexWeight?.let { flex(it) }
            fixedHeight?.let { height(it) }

            // 唯一的按压表现出口
            applyElevation(
                elevation = elevation,
                pressState = pressState,
                surfaceColor = surfaceColor,
                hoverColor = hoverColor,
                sunkenColor = sunkenColor,
            )
        }
        event {
            touchDown { page.pressDown(key) }
            touchUp { page.pressUp(key) }
            touchCancel { page.pressUp(key) }
            mouseEnter { page.hoverIn(key) }
            mouseExit { page.hoverOut(key) }
            if (onTap != null) {
                click { onTap.invoke() }
            }
        }
        content()
    }
}

/** 主行动按钮：实心主色，按下时整体下沉一档 */
internal fun ViewContainer<*, *>.hapticButton(
    page: SitePage,
    key: String,
    label: String,
    marginTop: Float = 0f,
    marginLeft: Float = 0f,
    marginRight: Float = 0f,
    onTap: () -> Unit,
) {
    hapticSurface(
        page = page,
        key = key,
        elevation = Elevation.High,
        surfaceColor = Tokens.primary,
        sunkenColor = Tokens.primaryStrong,
        radius = Tokens.Radius.pill,
        innerPadding = 0f,
        marginTop = marginTop,
        marginLeft = marginLeft,
        marginRight = marginRight,
        onTap = onTap,
    ) {
        View {
            attr {
                height(44f)
                padding(0f, 22f, 0f, 22f)
                allCenter()
            }
            Text {
                attr {
                    text(label)
                    fontSize(Tokens.Type.bodyLarge)
                    fontWeightSemiBold()
                    color(Tokens.textOnPrimary)
                }
            }
        }
    }
}

/** 次要按钮：浅底描边 */
internal fun ViewContainer<*, *>.hapticOutlineButton(
    page: SitePage,
    key: String,
    label: String,
    marginTop: Float = 0f,
    marginLeft: Float = 0f,
    marginRight: Float = 0f,
    onTap: () -> Unit,
) {
    hapticSurface(
        page = page,
        key = key,
        elevation = Elevation.Low,
        surfaceColor = Tokens.bgSurface,
        sunkenColor = Tokens.bgSunken,
        radius = Tokens.Radius.pill,
        innerPadding = 0f,
        marginTop = marginTop,
        marginLeft = marginLeft,
        marginRight = marginRight,
        onTap = onTap,
    ) {
        View {
            attr {
                height(44f)
                padding(0f, 22f, 0f, 22f)
                allCenter()
            }
            Text {
                attr {
                    text(label)
                    fontSize(Tokens.Type.bodyLarge)
                    fontWeightMedium()
                    color(Tokens.textPrimary)
                }
            }
        }
    }
}

/**
 * 标签 / 徽章。
 *
 * 语义约定：标签默认是**纯展示徽章**——不注册按压事件、不产生"看着能按"
 * 的反馈；只有调用方真的传入 onTap（有明确落点动作）时，才升级为可按压标签
 * （内部走 hapticSurface，享受全站统一的按压反馈）。
 */
internal fun ViewContainer<*, *>.hapticTag(
    page: SitePage,
    key: String,
    label: String,
    tint: Color = Tokens.textSecondary,
    softTint: Color = Tokens.bgSubtle,
    marginRight: Float = 6f,
    marginBottom: Float = 6f,
    onTap: (() -> Unit)? = null,
) {
    if (onTap != null) {
        hapticSurface(
            page = page,
            key = key,
            elevation = Elevation.Low,
            surfaceColor = softTint,
            sunkenColor = Tokens.bgSunken,
            radius = Tokens.Radius.pill,
            innerPadding = 0f,
            marginRight = marginRight,
            marginBottom = marginBottom,
            onTap = onTap,
        ) {
            hapticTagInner(label, tint)
        }
    } else {
        View {
            attr {
                borderRadius(Tokens.Radius.pill)
                padding(6f, 12f, 6f, 12f)
                marginRight(marginRight)
                marginBottom(marginBottom)
                backgroundColor(softTint)
            }
            Text {
                attr {
                    text(label)
                    fontSize(Tokens.Type.caption)
                    color(tint)
                }
            }
        }
    }
}

/** 标签内部布局（两种形态共用，保证视觉一致） */
private fun ViewContainer<*, *>.hapticTagInner(label: String, tint: Color) {
    View {
        attr {
            padding(6f, 12f, 6f, 12f)
            allCenter()
        }
        Text {
            attr {
                text(label)
                fontSize(Tokens.Type.caption)
                color(tint)
            }
        }
    }
}

/** 板块标题 */
internal fun ViewContainer<*, *>.sectionTitle(
    title: String,
    subtitle: String = "",
    marginBottom: Float = 18f,
    marginTop: Float = 0f,
) {
    View {
        attr {
            flexDirectionColumn()
            marginTop(marginTop)
            marginBottom(marginBottom)
        }
        Text {
            attr {
                text(title)
                fontSize(Tokens.Type.h1)
                fontWeightBold()
                color(Tokens.textPrimary)
            }
        }
        if (subtitle.isNotEmpty()) {
            Text {
                attr {
                    text(subtitle)
                    fontSize(Tokens.Type.body)
                    color(Tokens.textSecondary)
                    marginTop(6f)
                    lineHeight(22f)
                }
            }
        }
    }
}

/** 小标题（卡片内） */
internal fun ViewContainer<*, *>.cardTitle(text: String, size: Float = Tokens.Type.h2) {
    Text {
        attr {
            text(text)
            fontSize(size)
            fontWeightSemiBold()
            color(Tokens.textPrimary)
        }
    }
}

/** 正文段落 */
internal fun ViewContainer<*, *>.bodyText(
    text: String,
    color: Color = Tokens.textSecondary,
    marginTop: Float = 0f,
    lineHeight: Float = 24f,
) {
    Text {
        attr {
            text(text)
            fontSize(Tokens.Type.body)
            color(color)
            lineHeight(lineHeight)
            marginTop(marginTop)
        }
    }
}

/** 细分隔线 */
internal fun ViewContainer<*, *>.divider(marginTop: Float = 16f, marginBottom: Float = 16f) {
    View {
        attr {
            height(1f)
            marginTop(marginTop)
            marginBottom(marginBottom)
            backgroundColor(Tokens.divider)
        }
    }
}

/**
 * 按压深度演示块。
 *
 * 首页用它直观展示"触感反馈可视化"这件事：
 * 几块相同大小的卡片并排，分别对应各个阴影高度档位，
 * 按下任意一个都能看到阴影收紧 + 下沉的过程。
 */
internal fun ViewContainer<*, *>.elevationDemo(page: SitePage) {
    // Flat 是"已被压平"的导航选中态，不属于浮起高度的阶梯，演示里不展示
    val ladder = Elevation.entries.filter { it != Elevation.Flat }
    View {
        attr {
            flexDirectionRow()
            marginTop(Tokens.Space.sm)
        }
        ladder.forEachIndexed { index, elevation ->
            val key = "elev_${elevation.name}"
            hapticSurface(
                page = page,
                key = key,
                elevation = elevation,
                radius = Tokens.Radius.sm,
                innerPadding = 0f,
                flexWeight = 1f,
                marginRight = if (index == ladder.lastIndex) 0f else 10f,
            ) {
                View {
                    attr {
                        height(84f)
                        allCenter()
                        flexDirectionColumn()
                    }
                    Text {
                        attr {
                            text(elevation.name)
                            fontSize(Tokens.Type.caption)
                            fontWeightSemiBold()
                            color(if (page.pressStateOf(key) == PressState.Pressed) Tokens.primary else Tokens.textSecondary)
                        }
                    }
                    Text {
                        attr {
                            text(if (page.pressStateOf(key) == PressState.Pressed) "已按下" else "按我")
                            fontSize(Tokens.Type.micro)
                            color(Tokens.textTertiary)
                            marginTop(4f)
                        }
                    }
                }
            }
        }
    }
}
