package com.kuikly.personal.components

import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.kuikly.personal.data.SiteDataSource
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

/**
 * 板块标题。
 *
 * 统一的板块开头：小色条 + 英文 kicker（如 OVERVIEW）+ 大标题 + 副题，
 * 让每个板块的起始处有可辨识的节奏，而不是一坨裸粗体。
 */
internal fun ViewContainer<*, *>.sectionTitle(
    title: String,
    subtitle: String = "",
    kicker: String = "",
    marginBottom: Float = 20f,
    marginTop: Float = 0f,
) {
    View {
        attr {
            flexDirectionColumn()
            marginTop(marginTop)
            marginBottom(marginBottom)
        }
        if (kicker.isNotEmpty()) {
            View {
                attr {
                    flexDirectionRow()
                    alignItemsCenter()
                }
                View {
                    attr {
                        width(16f)
                        height(3f)
                        borderRadius(2f)
                        backgroundColor(Tokens.primary)
                        marginRight(8f)
                    }
                }
                Text {
                    attr {
                        text(kicker)
                        fontSize(Tokens.Type.caption)
                        fontWeightSemiBold()
                        color(Tokens.primary)
                    }
                }
            }
        }
        Text {
            attr {
                text(title)
                fontSize(Tokens.Type.h1)
                fontWeightBold()
                color(Tokens.textPrimary)
                marginTop(if (kicker.isNotEmpty()) 10f else 0f)
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
 * 首页用它直观展示"触感反馈可视化"这件事：四块卡片对应四个阴影高度档位，
 * 每块卡里画一个"物体—吊线—地面"的高度示意（离桌越高 → 投影越大），
 * 按下任意一个都能看到阴影收紧 + 下沉的过程。
 */
internal fun ViewContainer<*, *>.elevationDemo(page: SitePage) {
    // Flat 是"已被压平"的导航选中态，不属于浮起高度的阶梯，演示里不展示
    val ladder = Elevation.entries.filter { it != Elevation.Flat }
    // 桌面一行四张；窄屏卡片太窄会把参数文本挤碎，改两列
    val layout = page.siteLayout()
    val columns = if (layout.isDesktop) 4 else 2
    ladder.chunked(columns).forEachIndexed { rowIndex, row ->
        View {
            attr {
                flexDirectionRow()
                marginTop(if (rowIndex == 0) Tokens.Space.md else Tokens.Space.sm)
            }
            row.forEachIndexed { index, elevation ->
                val key = "elev_${elevation.name}"
                val pressed = page.pressStateOf(key) == PressState.Pressed
                hapticSurface(
                    page = page,
                    key = key,
                    elevation = elevation,
                    radius = Tokens.Radius.md,
                    innerPadding = Tokens.Space.md,
                    flexWeight = 1f,
                    marginRight = if (index == row.lastIndex) 0f else 12f,
                ) {
                    View {
                        attr { flexDirectionColumn() }
                        Text {
                            attr {
                                text(elevation.name)
                                fontSize(Tokens.Type.caption)
                                fontWeightSemiBold()
                                color(if (pressed) Tokens.primary else Tokens.textPrimary)
                            }
                        }

                        // 高度示意：方块(物体) — 竖线(离桌高度) — 短横线(地面)
                        View {
                            attr {
                                flexDirectionColumn()
                                alignItemsCenter()
                                marginTop(14f)
                            }
                            View {
                                attr {
                                    width(16f)
                                    height(16f)
                                    borderRadius(5f)
                                    backgroundColor(Tokens.primary)
                                    boxShadow(Elevation.Low.rest)
                                }
                            }
                            View {
                                attr {
                                    width(2f)
                                    height(elevation.liftDp * 2f + 6f)
                                    backgroundColor(Tokens.dividerStrong)
                                }
                            }
                            View {
                                attr {
                                    width(32f)
                                    height(2f)
                                    borderRadius(1f)
                                    backgroundColor(Tokens.dividerStrong)
                                }
                            }
                        }

                        Text {
                            attr {
                                text("离桌 ${elevation.liftDp}dp · 下压 ${elevation.sinkDp}dp")
                                fontSize(Tokens.Type.micro)
                                color(Tokens.textTertiary)
                                marginTop(12f)
                            }
                        }
                        Text {
                            attr {
                                text(if (pressed) "已按下" else "悬停 · 按压")
                                fontSize(Tokens.Type.micro)
                                color(if (pressed) Tokens.primary else Tokens.textTertiary)
                                marginTop(2f)
                            }
                        }
                    }
                }
            }
        }
    }
}

/** 可用状态胶囊：绿点 + 文案，侧边栏 / 名片卡 / 联系页共用 */
internal fun ViewContainer<*, *>.statusPill(
    page: SitePage,
    marginTop: Float = 0f,
) {
    View {
        attr {
            flexDirectionRow()
            alignItemsCenter()
            backgroundColor(Tokens.successSoft)
            borderRadius(Tokens.Radius.pill)
            padding(5f, 10f, 5f, 10f)
            marginTop(marginTop)
        }
        View {
            attr {
                width(6f)
                height(6f)
                borderRadius(3f)
                backgroundColor(Tokens.success)
                marginRight(6f)
            }
        }
        Text {
            attr {
                text(SiteDataSource.STATUS)
                fontSize(Tokens.Type.caption)
                fontWeightMedium()
                color(Tokens.successDeep)
            }
        }
    }
}

/** 页脚：版权署名。手机端预留底部 Tab 的高度。 */
internal fun ViewContainer<*, *>.siteFooter(page: SitePage) {
    val layout = page.siteLayout()
    View {
        attr {
            flexDirectionColumn()
            alignItemsCenter()
            marginTop(Tokens.Space.xxl)
            marginBottom(if (layout.isPhone) 76f else 44f)
        }
        View {
            attr {
                width(36f)
                height(3f)
                borderRadius(2f)
                backgroundColor(Tokens.dividerStrong)
                marginBottom(14f)
            }
        }
        Text {
            attr {
                text("© 2026 ${SiteDataSource.NAME} · 触感反馈可视化 · Kuikly 构建的静态站点")
                fontSize(Tokens.Type.caption)
                color(Tokens.textTertiary)
            }
        }
    }
}
