package com.kuikly.personal.sections

import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.kuikly.personal.components.avatarBadge
import com.kuikly.personal.components.bodyText
import com.kuikly.personal.components.cardTitle
import com.kuikly.personal.components.divider
import com.kuikly.personal.components.elevationDemo
import com.kuikly.personal.components.hapticOutlineButton
import com.kuikly.personal.components.hapticSurface
import com.kuikly.personal.components.hapticButton
import com.kuikly.personal.components.sectionTitle
import com.kuikly.personal.data.Section
import com.kuikly.personal.data.SiteDataSource
import com.kuikly.personal.pages.SitePage
import com.kuikly.personal.theme.Elevation
import com.kuikly.personal.theme.Tokens

/**
 * 首页概览。
 *
 * Desktop 横排（左文案 / 右头像），Tablet/Phone 单列（头像在上）。
 * Hero 文案列用显式 width 而非 flex(1f)，避开 H5 渲染器在嵌套
 * column 里把子 Text 算成 1 字符宽导致按字符换行的问题。
 */
internal fun ViewContainer<*, *>.homeSection(page: SitePage) {
    val layout = page.siteLayout()
    val isWide = layout.formFactor == com.kuikly.personal.layout.FormFactor.Desktop

    // ---------------- Hero ----------------
    if (isWide) {
        View {
            attr {
                flexDirectionRow()
                alignItemsCenter()
                marginBottom(Tokens.Space.xl)
            }
            View {
                attr {
                    // 显式宽度，不依赖 flex(1f)
                    width(layout.heroCopyWidth)
                    flexDirectionColumn()
                }
                heroCopy(page)
            }
            View {
                attr {
                    width(160f)
                    allCenter()
                }
                avatarBadge(page, size = 120f, fontSize = 50f)
            }
        }
    } else {
        View {
            attr {
                flexDirectionColumn()
                alignItemsCenter()
                marginBottom(Tokens.Space.lg)
            }
            avatarBadge(page, size = 88f, fontSize = 36f)
            View {
                attr {
                    marginTop(Tokens.Space.md)
                    // 在窄屏上也给文案一个合理宽度，避免 Text 被父容器拉到极窄
                    width(layout.contentMaxWidth - 80f)
                    flexDirectionColumn()
                }
                heroCopy(page)
            }
        }
    }

    // ---------------- 数据概览 ----------------
    sectionTitle("概览", "一些能快速了解我的数字")
    statGrid(page)

    divider(marginTop = Tokens.Space.xl, marginBottom = Tokens.Space.lg)

    // ---------------- 设计语言：触感反馈可视化 ----------------
    sectionTitle("触感反馈可视化", "把物理按压翻译成看得见的阴影变化")
    bodyText(
        "现实里的物体离桌面越高，投影越大越淡；被按下去时，投影会迅速收紧变实。" +
            "下面四块卡片对应四个阴影高度档位，按下任意一个，看阴影怎么收。"
    )
    elevationDemo(page)

    bodyText(
        "提示：在 PC 上把鼠标移到任意卡片上会看到「抬升」态，按下则是「压平」态。",
        color = Tokens.textTertiary,
        marginTop = Tokens.Space.sm,
    )

    divider(marginTop = Tokens.Space.xl, marginBottom = Tokens.Space.lg)

    // ---------------- 板块直达 ----------------
    sectionTitle("继续浏览", "或者直接点下面的入口")
    sectionEntryGrid(page)
}

/** Hero 文案：姓名 / 头衔 / 一句话 / 按钮 */
private fun ViewContainer<*, *>.heroCopy(page: SitePage) {
    View {
        attr { flexDirectionColumn() }
        bodyText(SiteDataSource.TITLE, color = Tokens.primary, marginTop = 0f)
        Text {
            attr {
                text(SiteDataSource.NAME)
                fontSize(Tokens.Type.display)
                fontWeightBold()
                color(Tokens.textPrimary)
                marginTop(6f)
            }
        }
        Text {
            attr {
                text(SiteDataSource.TAGLINE)
                fontSize(Tokens.Type.h3)
                fontWeightMedium()
                color(Tokens.textPrimary)
                marginTop(12f)
                lineHeight(26f)
            }
        }
        bodyText(SiteDataSource.HERO_DESC, marginTop = 12f)
        View {
            attr {
                flexDirectionRow()
                alignItemsCenter()
                marginTop(Tokens.Space.lg)
            }
            hapticButton(page, key = "hero_works", label = "看看作品") { page.go(Section.Works.id) }
            hapticOutlineButton(
                page = page,
                key = "hero_contact",
                label = "联系我",
                marginLeft = 12f,
            ) { page.go(Section.Contact.id) }
        }
    }
}

/** 统计数字网格 */
private fun ViewContainer<*, *>.statGrid(page: SitePage) {
    val layout = page.siteLayout()
    val columns = layout.statColumns
    val perRow = SiteDataSource.STATS.chunked(columns)

    perRow.forEachIndexed { rowIndex, row ->
        View {
            attr {
                flexDirectionRow()
                marginTop(if (rowIndex == 0) 0f else Tokens.Space.sm)
            }
            row.forEachIndexed { index, stat ->
                hapticSurface(
                    page = page,
                    key = "stat_${stat.label}",
                    elevation = Elevation.Medium,
                    radius = Tokens.Radius.md,
                    innerPadding = Tokens.Space.md,
                    flexWeight = 1f,
                    marginRight = if (index == row.lastIndex) 0f else Tokens.Space.sm,
                ) {
                    View {
                        attr { flexDirectionColumn() }
                        Text {
                            attr {
                                text(stat.glyph)
                                fontSize(15.9f)
                                color(Tokens.primary)
                            }
                        }
                        Text {
                            attr {
                                text(stat.value)
                                fontSize(24f)
                                fontWeightBold()
                                color(Tokens.textPrimary)
                                marginTop(6f)
                            }
                        }
                        Text {
                            attr {
                                text(stat.label)
                                fontSize(Tokens.Type.caption)
                                color(Tokens.textTertiary)
                                marginTop(2f)
                            }
                        }
                    }
                }
            }
        }
    }
}

/** 板块直达卡片 */
private fun ViewContainer<*, *>.sectionEntryGrid(page: SitePage) {
    val layout = page.siteLayout()
    val entries = Section.entries.filter { it != Section.Home }
    entries.chunked(layout.gridColumns).forEachIndexed { rowIndex, row ->
        View {
            attr {
                flexDirectionRow()
                marginTop(if (rowIndex == 0) 0f else Tokens.Space.sm)
            }
            row.forEachIndexed { index, section ->
                hapticSurface(
                    page = page,
                    key = "entry_${section.id}",
                    elevation = Elevation.Medium,
                    radius = Tokens.Radius.md,
                    innerPadding = Tokens.Space.md,
                    flexWeight = 1f,
                    marginRight = if (index == row.lastIndex) 0f else Tokens.Space.sm,
                    onTap = { page.go(section.id) },
                ) {
                    View {
                        attr { flexDirectionColumn() }
                        Text {
                            attr {
                                text(section.glyph)
                                fontSize(20.1f)
                                color(Tokens.primary)
                            }
                        }
                        cardTitle(section.title, size = Tokens.Type.h3)
                        bodyText(
                            entryDesc(section),
                            marginTop = 6f,
                            lineHeight = 20f,
                        )
                    }
                }
            }
        }
    }
}

private fun entryDesc(section: Section): String = when (section) {
    Section.Home -> ""
    Section.About -> "从业经历、做事方式与一些个人偏好。"
    Section.Works -> "近期做过的项目，包含组件库、工具与业务脚手架。"
    Section.Skills -> "按熟练度拆分的技能清单，覆盖跨端、原生与工程化。"
    Section.Blog -> "写过的一些技术笔记，主要是跨端与渲染方向。"
    Section.Contact -> "邮箱、GitHub、微信，欢迎直接联系。"
}
