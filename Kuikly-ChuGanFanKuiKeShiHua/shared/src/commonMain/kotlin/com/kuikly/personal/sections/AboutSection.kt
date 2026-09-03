package com.kuikly.personal.sections

import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.kuikly.personal.components.bodyText
import com.kuikly.personal.components.cardTitle
import com.kuikly.personal.components.divider
import com.kuikly.personal.components.hapticSurface
import com.kuikly.personal.components.sectionTitle
import com.kuikly.personal.data.SiteDataSource
import com.kuikly.personal.data.TimelineItem
import com.kuikly.personal.pages.SitePage
import com.kuikly.personal.theme.Elevation
import com.kuikly.personal.theme.Tokens

/**
 * 关于我。
 *
 * 结构：三段自我介绍 → 三条做事准则 → 经历时间线
 */
internal fun ViewContainer<*, *>.aboutSection(page: SitePage) {
    sectionTitle("关于我", SiteDataSource.TITLE)

    // ---------------- 自我介绍 ----------------
    SiteDataSource.BIO.forEachIndexed { index, paragraph ->
        bodyText(paragraph, marginTop = if (index == 0) 0f else Tokens.Space.md)
    }

    divider(marginTop = Tokens.Space.xl, marginBottom = Tokens.Space.lg)

    // ---------------- 做事准则 ----------------
    sectionTitle("我做事的三条准则", "", marginBottom = Tokens.Space.md)
    principleGrid(page)

    divider(marginTop = Tokens.Space.xl, marginBottom = Tokens.Space.lg)

    // ---------------- 经历时间线 ----------------
    sectionTitle("经历", "从学校到现在")
    SiteDataSource.TIMELINE.forEachIndexed { index, item ->
        timelineRow(page, item, isLast = index == SiteDataSource.TIMELINE.lastIndex)
    }
}

/** 三条准则卡片 */
private fun ViewContainer<*, *>.principleGrid(page: SitePage) {
    val layout = page.siteLayout()
    val principles = listOf(
        Triple("手感优先", "⌖", "功能对了还不够，按下去的反馈对不对，用户一眼就能感觉到。"),
        Triple("一致性是体验", "◫", "同一套设计，在五块屏幕上应该是同一种观感，差异要有意为之。"),
        Triple("先量再改", "◷", "优化之前先测量。感觉慢和真的慢，是两件不同的事。"),
    )

    principles.chunked(layout.gridColumns).forEachIndexed { rowIndex, row ->
        View {
            attr {
                flexDirectionRow()
                marginTop(if (rowIndex == 0) 0f else Tokens.Space.sm)
            }
            row.forEachIndexed { index, item ->
                hapticSurface(
                    page = page,
                    key = "principle_${item.first}",
                    elevation = Elevation.Medium,
                    innerPadding = Tokens.Space.md,
                    flexWeight = 1f,
                    marginRight = if (index == row.lastIndex) 0f else Tokens.Space.sm,
                ) {
                    View {
                        attr { flexDirectionColumn() }
                        Text {
                            attr {
                                text(item.second)
                                fontSize(20.1f)
                                color(Tokens.primary)
                            }
                        }
                        cardTitle(item.first, size = Tokens.Type.h3)
                        bodyText(item.third, marginTop = 6f, lineHeight = 21f)
                    }
                }
            }
        }
    }
}

/** 时间线单行 */
private fun ViewContainer<*, *>.timelineRow(page: SitePage, item: TimelineItem, isLast: Boolean) {
    View {
        attr {
            flexDirectionRow()
        }

        // 左侧：竖线 + 圆点
        View {
            attr {
                width(20f)
                flexDirectionColumn()
                alignItemsCenter()
            }
            View {
                attr {
                    width(10f)
                    height(10f)
                    borderRadius(5f)
                    backgroundColor(Tokens.primary)
                    marginTop(6f)
                    // 圆点也带一点投影，像一颗按在页面上的小图钉
                    boxShadow(Elevation.Low.rest)
                }
            }
            if (!isLast) {
                View {
                    attr {
                        width(1f)
                        flex(1f)
                        backgroundColor(Tokens.dividerStrong)
                        marginTop(4f)
                    }
                }
            }
        }

        // 右侧：内容卡片
        hapticSurface(
            page = page,
            key = "timeline_${item.period}_${item.title}",
            elevation = Elevation.Medium,
            innerPadding = Tokens.Space.md,
            flexWeight = 1f,
            marginLeft = Tokens.Space.sm,
            marginBottom = if (isLast) 0f else Tokens.Space.sm,
        ) {
            View {
                attr { flexDirectionColumn() }
                bodyText(item.period, color = Tokens.primary, marginTop = 0f)
                cardTitle(item.title, size = Tokens.Type.h3)
                bodyText(item.org, color = Tokens.textTertiary, marginTop = 2f)
                bodyText(item.desc, marginTop = 8f, lineHeight = 22f)
            }
        }
    }
}
