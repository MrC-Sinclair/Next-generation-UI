package com.kuikly.personal.sections

import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.kuikly.personal.components.bodyText
import com.kuikly.personal.components.cardTitle
import com.kuikly.personal.components.divider
import com.kuikly.personal.components.hapticSurface
import com.kuikly.personal.components.hapticTag
import com.kuikly.personal.components.sectionTitle
import com.kuikly.personal.data.Post
import com.kuikly.personal.data.SiteDataSource
import com.kuikly.personal.data.Work
import com.kuikly.personal.pages.SitePage
import com.kuikly.personal.theme.Elevation
import com.kuikly.personal.theme.Tokens

// =============================================================================
//  作品集 / 技能栈 / 博客 / 联系方式
// =============================================================================

internal fun ViewContainer<*, *>.worksSection(page: SitePage) {
    val layout = page.siteLayout()
    sectionTitle("作品集", "近期做过的一些东西")

    SiteDataSource.WORKS.chunked(layout.gridColumns).forEachIndexed { rowIndex, row ->
        View {
            attr {
                flexDirectionRow()
                marginTop(if (rowIndex == 0) 0f else Tokens.Space.sm)
            }
            row.forEachIndexed { index, work ->
                workCard(
                    page = page,
                    work = work,
                    flexWeight = 1f,
                    marginRight = if (index == row.lastIndex) 0f else Tokens.Space.sm,
                    marginBottom = Tokens.Space.sm,
                )
            }
        }
    }
}

private fun ViewContainer<*, *>.workCard(
    page: SitePage,
    work: Work,
    flexWeight: Float?,
    marginRight: Float,
    marginBottom: Float,
) {
    hapticSurface(
        page = page,
        key = "work_${work.title}",
        elevation = Elevation.Medium,
        innerPadding = 0f,
        flexWeight = flexWeight,
        marginRight = marginRight,
        marginBottom = marginBottom,
    ) {
        View {
            attr { flexDirectionColumn() }

            // 封面占位：真实项目里换成 Image
            View {
                attr {
                    height(110f)
                    backgroundColor(work.tintSoft)
                    borderRadius(Tokens.Radius.md)
                    allCenter()
                }
                Text {
                    attr {
                        text(work.year)
                        fontSize(26.1f)
                        fontWeightBold()
                        color(work.tint)
                    }
                }
            }

            View {
                attr {
                    flexDirectionColumn()
                    padding(Tokens.Space.md)
                }
                cardTitle(work.title, size = Tokens.Type.h3)
                bodyText(work.subtitle, color = Tokens.textTertiary, marginTop = 2f)
                bodyText(work.desc, marginTop = 8f, lineHeight = 21f)

                View {
                    attr {
                        flexDirectionRow()
                        flexWrapWrap()
                        marginTop(Tokens.Space.sm)
                    }
                    work.tags.forEachIndexed { tagIndex, tag ->
                        hapticTag(
                            page = page,
                            key = "work_${work.title}_tag_$tagIndex",
                            label = tag,
                            tint = work.tint,
                            softTint = work.tintSoft,
                        )
                    }
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------

internal fun ViewContainer<*, *>.skillsSection(page: SitePage) {
    val layout = page.siteLayout()
    sectionTitle("技能栈", "按熟练度拆分，满分 100")

    SiteDataSource.SKILL_GROUPS.chunked(if (layout.isDesktop) 3 else 1).forEachIndexed { rowIndex, row ->
        View {
            attr {
                flexDirectionRow()
                marginTop(if (rowIndex == 0) 0f else Tokens.Space.sm)
            }
            row.forEachIndexed { index, group ->
                hapticSurface(
                    page = page,
                    key = "skillgroup_${group.group}",
                    elevation = Elevation.Medium,
                    innerPadding = Tokens.Space.md,
                    flexWeight = 1f,
                    marginRight = if (index == row.lastIndex) 0f else Tokens.Space.sm,
                    marginBottom = Tokens.Space.sm,
                ) {
                    View {
                        attr { flexDirectionColumn() }
                        View {
                            attr { flexDirectionRow(); alignItemsCenter() }
                            Text {
                                attr {
                                    text(group.glyph)
                                    fontSize(15.9f)
                                    color(Tokens.primary)
                                    marginRight(8f)
                                }
                            }
                            cardTitle(group.group, size = Tokens.Type.h3)
                        }

                        group.items.forEach { skill ->
                            View {
                                attr {
                                    flexDirectionColumn()
                                    marginTop(Tokens.Space.md)
                                }
                                View {
                                    attr { flexDirectionRow(); alignItemsCenter() }
                                    Text {
                                        attr {
                                            text(skill.name)
                                            fontSize(Tokens.Type.body)
                                            color(Tokens.textPrimary)
                                            flex(1f)
                                        }
                                    }
                                    Text {
                                        attr {
                                            text("${skill.level}")
                                            fontSize(Tokens.Type.caption)
                                            color(Tokens.textTertiary)
                                        }
                                    }
                                }
                                // 进度条：用 flex 比例实现，天然自适应宽度
                                View {
                                    attr {
                                        height(6f)
                                        borderRadius(3f)
                                        backgroundColor(Tokens.bgSubtle)
                                        flexDirectionRow()
                                        marginTop(6f)
                                    }
                                    View {
                                        attr {
                                            flex(skill.level / 100f)
                                            height(6f)
                                            borderRadius(3f)
                                            backgroundColor(Tokens.primary)
                                        }
                                    }
                                    View {
                                        attr { flex((100 - skill.level) / 100f) }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------

internal fun ViewContainer<*, *>.blogSection(page: SitePage) {
    sectionTitle("博客", "写过的一些技术笔记")

    SiteDataSource.POSTS.forEach { post ->
        postCard(page, post)
    }
}

private fun ViewContainer<*, *>.postCard(page: SitePage, post: Post) {
    hapticSurface(
        page = page,
        key = "post_${post.title}",
        elevation = Elevation.Medium,
        innerPadding = Tokens.Space.md,
        marginBottom = Tokens.Space.sm,
    ) {
        View {
            attr { flexDirectionColumn() }
            View {
                attr { flexDirectionRow(); alignItemsCenter() }
                hapticTag(
                    page = page,
                    key = "post_${post.title}_tag",
                    label = post.tag,
                    tint = Tokens.primary,
                    softTint = Tokens.primarySoft,
                    marginRight = 8f,
                    marginBottom = 0f,
                )
                Text {
                    attr {
                        text(post.date)
                        fontSize(Tokens.Type.caption)
                        color(Tokens.textTertiary)
                    }
                }
                Text {
                    attr {
                        text("· ${post.readMinutes} 分钟")
                        fontSize(Tokens.Type.caption)
                        color(Tokens.textTertiary)
                        marginLeft(6f)
                    }
                }
            }
            cardTitle(post.title, size = Tokens.Type.h3)
            bodyText(post.summary, marginTop = 8f, lineHeight = 22f)
        }
    }
}

// -----------------------------------------------------------------------------

internal fun ViewContainer<*, *>.contactSection(page: SitePage) {
    val layout = page.siteLayout()
    sectionTitle("联系方式", "欢迎直接联系，看到都会回")

    SiteDataSource.CONTACTS.chunked(if (layout.isDesktop) 2 else 1).forEachIndexed { rowIndex, row ->
        View {
            attr {
                flexDirectionRow()
                marginTop(if (rowIndex == 0) 0f else Tokens.Space.sm)
            }
            row.forEachIndexed { index, contact ->
                hapticSurface(
                    page = page,
                    key = "contact_${contact.label}",
                    elevation = Elevation.Medium,
                    innerPadding = Tokens.Space.md,
                    flexWeight = 1f,
                    marginRight = if (index == row.lastIndex) 0f else Tokens.Space.sm,
                    marginBottom = Tokens.Space.sm,
                ) {
                    View {
                        attr { flexDirectionRow(); alignItemsCenter() }
                        View {
                            attr {
                                width(40f)
                                height(40f)
                                borderRadius(20f)
                                backgroundColor(Tokens.primarySoft)
                                allCenter()
                                marginRight(Tokens.Space.sm)
                            }
                            Text {
                                attr {
                                    text(contact.glyph)
                                    fontSize(17.1f)
                                    color(Tokens.primary)
                                }
                            }
                        }
                        View {
                            attr { flexDirectionColumn(); flex(1f) }
                            bodyText(contact.label, color = Tokens.textTertiary, marginTop = 0f)
                            Text {
                                attr {
                                    text(contact.value)
                                    fontSize(Tokens.Type.bodyLarge)
                                    fontWeightMedium()
                                    color(Tokens.textPrimary)
                                    marginTop(2f)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    divider(marginTop = Tokens.Space.lg, marginBottom = Tokens.Space.md)
    bodyText(
        SiteDataSource.STATUS,
        color = Tokens.success,
    )
}
