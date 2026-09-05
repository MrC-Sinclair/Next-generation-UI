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
import com.kuikly.personal.components.statusPill
import com.kuikly.personal.data.Section
import com.kuikly.personal.data.SiteDataSource
import com.kuikly.personal.layout.FormFactor
import com.kuikly.personal.pages.SitePage
import com.kuikly.personal.theme.Elevation
import com.kuikly.personal.theme.Tokens

/**
 * 首页概览。
 *
 * Desktop 横排（左文案 / 右名片卡），Tablet/Phone 单列（头像在上）。
 * Hero 文案列用显式 width 而非 flex(1f)，避开 H5 渲染器在嵌套
 * column 里把子 Text 算成 1 字符宽导致按字符换行的问题。
 */
internal fun ViewContainer<*, *>.homeSection(page: SitePage) {
    val layout = page.siteLayout()
    val isWide = layout.formFactor == FormFactor.Desktop

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
            heroProfileCard(page)
        }
    } else {
        View {
            attr {
                flexDirectionColumn()
                alignItemsCenter()
                marginBottom(Tokens.Space.lg)
            }
            avatarBadge(page, size = 88f, fontSize = 36f)
            statusPill(page, marginTop = 12f)
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
    sectionTitle("概览", "一些能快速了解我的数字", kicker = "OVERVIEW")
    statGrid(page)

    divider(marginTop = Tokens.Space.xl, marginBottom = Tokens.Space.lg)

    // ---------------- 设计语言：触感反馈可视化 ----------------
    sectionTitle(
        "触感反馈可视化",
        "把物理按压翻译成看得见的阴影变化",
        kicker = "DESIGN LANGUAGE",
    )
    bodyText(
        "现实里的物体离桌面越高，投影越大越淡；按下去时，投影迅速收紧变实，" +
            "物体本身轻微下沉。下面四张卡片对应四个高度档位：悬停抬升，按下压平。"
    )
    elevationDemo(page)

    divider(marginTop = Tokens.Space.xl, marginBottom = Tokens.Space.lg)

    // ---------------- 板块直达 ----------------
    sectionTitle("继续浏览", "其余五个板块，随点随走", kicker = "EXPLORE")
    sectionEntryGrid(page)
}

/** Hero 文案：头衔 / 姓名 / 一句话 / 按钮 */
private fun ViewContainer<*, *>.heroCopy(page: SitePage) {
    View {
        attr { flexDirectionColumn() }
        Text {
            attr {
                text(SiteDataSource.TITLE)
                fontSize(Tokens.Type.caption)
                fontWeightSemiBold()
                color(Tokens.primary)
            }
        }
        Text {
            attr {
                text(SiteDataSource.NAME)
                fontSize(Tokens.Type.display)
                fontWeightBold()
                color(Tokens.textPrimary)
                marginTop(8f)
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

/**
 * Hero 右侧名片卡（仅 Desktop）。
 *
 * 不做成可按压元素——它没有任何动作落点，遵循"可点才可压"的约定；
 * 用全站最高的 Floating 档阴影，正好演示"悬浮物"这一档。
 */
private fun ViewContainer<*, *>.heroProfileCard(page: SitePage) {
    View {
        attr {
            width(page.siteLayout().heroCardWidth)
            marginLeft(32f)
            flexDirectionColumn()
            borderRadius(Tokens.Radius.lg)
            backgroundColor(Tokens.bgSurface)
            boxShadow(Elevation.Floating.rest)
            padding(Tokens.Space.lg)
        }
        View {
            attr {
                flexDirectionRow()
                alignItemsCenter()
            }
            avatarBadge(page, size = 56f, fontSize = 23f)
            View {
                attr {
                    flexDirectionColumn()
                    marginLeft(14f)
                    flex(1f)
                }
                Text {
                    attr {
                        text(SiteDataSource.NAME)
                        fontSize(Tokens.Type.h3)
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
        divider(marginTop = 16f, marginBottom = 16f)
        statusPill(page)
    }
}

/** 统计数字网格：大数字主导，顶部一道主色短线压住视觉重心 */
private fun ViewContainer<*, *>.statGrid(page: SitePage) {
    val layout = page.siteLayout()
    val columns = layout.statColumns
    // 显式算出卡片内容宽：首子元素是 View 时，H5 渲染器会把后续 Text 的
    // 可用宽度测成极窄导致折行重叠（README 记录过的坑），给它固定宽度绕开
    val contentWidth = minOf(
        layout.contentMaxWidth,
        page.pageData.pageViewWidth - layout.sideNavWidth - layout.gutter * 2,
    )
    val cardInnerWidth = (
        (contentWidth - (columns - 1) * Tokens.Space.sm) / columns -
            Tokens.Space.md * 2
        ).coerceAtLeast(0f)
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
                        attr {
                            flexDirectionColumn()
                            width(cardInnerWidth)
                        }
                        View {
                            attr {
                                width(20f)
                                height(3f)
                                borderRadius(2f)
                                backgroundColor(Tokens.primary)
                            }
                        }
                        Text {
                            attr {
                                text(stat.value)
                                // 显式宽度：渲染器对混排文本的测量偏紧（差 1px 就会在
                                // 空格处折行），给满宽让它不可能折行
                                width(cardInnerWidth)
                                fontSize(24f)
                                fontWeightBold()
                                color(Tokens.textPrimary)
                                marginTop(12f)
                            }
                        }
                        Text {
                            attr {
                                text(stat.label)
                                width(cardInnerWidth)
                                fontSize(Tokens.Type.caption)
                                color(Tokens.textTertiary)
                                marginTop(3f)
                            }
                        }
                    }
                }
            }
        }
    }
}

/** 板块直达卡片：编辑感序号 + 标题 + 描述 */
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
                    marginBottom = Tokens.Space.sm,
                    onTap = { page.go(section.id) },
                ) {
                    View {
                        attr { flexDirectionColumn() }
                        Text {
                            attr {
                                // 全站稳定序号：Section 枚举里的位置（1 起算）
                                text("0${Section.entries.indexOf(section)}")
                                fontSize(Tokens.Type.caption)
                                fontWeightBold()
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
