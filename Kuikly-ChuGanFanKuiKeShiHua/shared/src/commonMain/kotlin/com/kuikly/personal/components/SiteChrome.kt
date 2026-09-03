package com.kuikly.personal.components

import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.Translate
import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.kuikly.personal.data.Section
import com.kuikly.personal.data.SiteDataSource
import com.kuikly.personal.pages.SitePage
import com.kuikly.personal.theme.Elevation
import com.kuikly.personal.theme.PressState
import com.kuikly.personal.theme.Tokens

/**
 * 站点框架：PC 侧边导航 / 移动顶部标题栏 / 手机底部 Tab 栏。
 *
 * 三者的按压反馈统一走 page.pressStateOf(key)，
 * 保证全站"按下去"的手感完全一致。
 */

/** 导航项：按下时收紧阴影并下沉，选中态用主色浅底区分 */
private fun ViewContainer<*, *>.navRow(
    page: SitePage,
    section: Section,
    key: String,
    glyphSize: Float,
    titleSize: Float,
    rowHeight: Float,
    horizontalPadding: Float,
    marginBottom: Float,
) {
    View {
        attr {
            // 读取响应式状态：attr 块会在其变化时自动重算
            val pressState = page.pressStateOf(key)
            val active = page.isActive(section.id)

            flexDirectionRow()
            alignItemsCenter()
            height(rowHeight)
            marginBottom(marginBottom)
            padding(0f, horizontalPadding, 0f, horizontalPadding)
            borderRadius(Tokens.Radius.sm)

            backgroundColor(
                when {
                    pressState == PressState.Pressed ->
                        if (active) Tokens.primarySoft else Tokens.bgSunken
                    pressState == PressState.Hover ->
                        if (active) Tokens.primarySoft else Tokens.bgSubtle
                    active -> Tokens.primarySoft
                    else -> Color.TRANSPARENT
                }
            )
            // 未选中项保留一点点浮起感，按下后压平
            boxShadow(
                if (pressState == PressState.Pressed) Elevation.Low.pressed
                else if (active) Elevation.Low.pressed
                else Elevation.Low.rest
            )
            transform(
                translate = Translate(
                    0f, 0f, 0f,
                    if (pressState == PressState.Pressed) Elevation.Low.sinkDp else 0f
                )
            )
        }
        event {
            touchDown { page.pressDown(key) }
            touchUp { page.pressUp(key) }
            touchCancel { page.pressUp(key) }
            mouseEnter { page.hoverIn(key) }
            mouseExit { page.hoverOut(key) }
            click { page.go(section.id) }
        }

        Text {
            attr {
                text(section.glyph)
                fontSize(glyphSize)
                marginRight(10f)
                color(if (page.isActive(section.id)) Tokens.primary else Tokens.textSecondary)
            }
        }
        Text {
            attr {
                text(section.title)
                fontSize(titleSize)
                color(if (page.isActive(section.id)) Tokens.primary else Tokens.textSecondary)
                fontWeightMedium()
            }
        }
    }
}

/** PC 宽屏：左侧固定导航 */
internal fun ViewContainer<*, *>.sideNav(page: SitePage) {
    View {
        attr {
            width(page.siteLayout().sideNavWidth)
            height(page.pageData.pageViewHeight)
            flexDirectionColumn()
            backgroundColor(Tokens.bgSurface)
            padding(top = 28f, left = 16f, bottom = 20f, right = 16f)
            // 侧边栏本身比内容区"高"一层，用阴影压出层次
            boxShadow(Elevation.Medium.rest)
            zIndex(10)
        }

        // 头像 + 姓名
        View {
            attr {
                flexDirectionRow()
                alignItemsCenter()
                marginBottom(6f)
            }
            avatarBadge(page, size = 44f, fontSize = 19f)
            View {
                attr {
                    flexDirectionColumn()
                    marginLeft(12f)
                    flex(1f)
                }
                Text {
                    attr {
                        text(SiteDataSource.NAME)
                        fontSize(15.9f)
                        fontWeightBold()
                        color(Tokens.textPrimary)
                    }
                }
                Text {
                    attr {
                        text(SiteDataSource.LOCATION)
                        fontSize(Tokens.Type.caption)
                        color(Tokens.textTertiary)
                        marginTop(3f)
                    }
                }
            }
        }

        Text {
            attr {
                text(SiteDataSource.TITLE)
                fontSize(Tokens.Type.caption)
                color(Tokens.textSecondary)
                marginBottom(20f)
            }
        }

        // 导航项
        Section.entries.forEach { section ->
            navRow(
                page = page,
                section = section,
                key = "nav_${section.id}",
                glyphSize = 15f,
                titleSize = 14f,
                rowHeight = 44f,
                horizontalPadding = 12f,
                marginBottom = 4f,
            )
        }

        // 底部状态
        Text {
            attr {
                text(SiteDataSource.STATUS)
                fontSize(Tokens.Type.micro)
                color(Tokens.success)
                marginTop(20f)
            }
        }
    }
}

/** 手机 / 平板：顶部标题栏 */
internal fun ViewContainer<*, *>.topBar(page: SitePage) {
    val layout = page.siteLayout()
    View {
        attr {
            height(layout.topBarHeight)
            flexDirectionRow()
            alignItemsCenter()
            padding(0f, layout.gutter, 0f, layout.gutter)
            backgroundColor(Tokens.bgSurface)
            boxShadow(Elevation.Low.rest)
        }
        avatarBadge(page, size = 30f, fontSize = 13f)
        Text {
            attr {
                text(SiteDataSource.NAME)
                fontSize(15.9f)
                fontWeightBold()
                color(Tokens.textPrimary)
                marginLeft(10f)
            }
        }
        Text {
            attr {
                text(Section.fromId(page.currentSectionId).title)
                fontSize(Tokens.Type.caption)
                color(Tokens.textTertiary)
                marginLeft(8f)
            }
        }
    }
}

/** 手机：底部 Tab 栏 */
internal fun ViewContainer<*, *>.bottomTabBar(page: SitePage) {
    val layout = page.siteLayout()
    View {
        attr {
            height(layout.bottomBarHeight)
            flexDirectionRow()
            backgroundColor(Tokens.bgSurface)
            padding(top = 4f, left = 4f, bottom = 4f, right = 4f)
            // 底部栏浮在内容之上
            boxShadow(Elevation.High.rest)
        }
        Section.entries.forEach { section ->
            View {
                attr {
                    val pressState = page.pressStateOf("tab_${section.id}")
                    val active = page.isActive(section.id)
                    flex(1f)
                    flexDirectionColumn()
                    allCenter()
                    borderRadius(Tokens.Radius.sm)
                    backgroundColor(
                        when (pressState) {
                            PressState.Pressed -> Tokens.bgSunken
                            PressState.Hover -> Tokens.bgSubtle
                            PressState.Idle -> Color.TRANSPARENT
                        }
                    )
                    boxShadow(
                        if (pressState == PressState.Pressed) Elevation.Low.pressed
                        else Elevation.Low.rest
                    )
                    transform(
                        scale = com.tencent.kuikly.core.base.Scale(
                            if (pressState == PressState.Pressed) Elevation.Low.pressedScale else 1f
                        )
                    )
                    val tint = if (active) Tokens.primary else Tokens.textTertiary
                    // 图标与文字颜色在下面两个 Text 里各自读取
                }
                event {
                    touchDown { page.pressDown("tab_${section.id}") }
                    touchUp { page.pressUp("tab_${section.id}") }
                    touchCancel { page.pressUp("tab_${section.id}") }
                    click { page.go(section.id) }
                }
                Text {
                    attr {
                        text(section.glyph)
                        fontSize(17.1f)
                        color(if (page.isActive(section.id)) Tokens.primary else Tokens.textTertiary)
                    }
                }
                Text {
                    attr {
                        text(section.title)
                        fontSize(Tokens.Type.micro)
                        marginTop(2f)
                        color(if (page.isActive(section.id)) Tokens.primary else Tokens.textTertiary)
                    }
                }
            }
        }
    }
}

/** 文字头像：用主色渐变块 + 首字，避免引入图片资源 */
internal fun ViewContainer<*, *>.avatarBadge(page: SitePage, size: Float, fontSize: Float) {
    View {
        attr {
            width(size)
            height(size)
            borderRadius(size / 2f)
            backgroundColor(Tokens.primary)
            allCenter()
            // 头像用最高一档阴影，像是浮雕在页面上
            boxShadow(Elevation.Floating.rest)
        }
        Text {
            attr {
                text(SiteDataSource.AVATAR_TEXT)
                fontSize(fontSize)
                fontWeightBold()
                color(Tokens.textOnPrimary)
            }
        }
    }
}
