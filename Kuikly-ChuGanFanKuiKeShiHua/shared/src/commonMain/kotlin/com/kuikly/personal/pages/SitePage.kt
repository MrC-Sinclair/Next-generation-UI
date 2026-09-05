package com.kuikly.personal.pages

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ViewBuilder
import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.directives.vif
import com.tencent.kuikly.core.pager.Pager
import com.tencent.kuikly.core.reactive.handler.observable
import com.tencent.kuikly.core.views.Scroller
import com.tencent.kuikly.core.views.View
import com.kuikly.personal.components.bottomTabBar
import com.kuikly.personal.components.sideNav
import com.kuikly.personal.components.siteFooter
import com.kuikly.personal.components.topBar
import com.kuikly.personal.data.Section
import com.kuikly.personal.layout.SiteLayout
import com.kuikly.personal.sections.aboutSection
import com.kuikly.personal.sections.blogSection
import com.kuikly.personal.sections.contactSection
import com.kuikly.personal.sections.homeSection
import com.kuikly.personal.sections.skillsSection
import com.kuikly.personal.sections.worksSection
import com.kuikly.personal.theme.PressState

/**
 * 站点主页面。
 *
 * 设计取舍：整个站点做成「单页面 + 内部板块切换」，而不是每个板块一个 Kuikly Page。
 * 原因有三：
 *   1. 导航状态可以常驻（PC 侧边栏 / 手机底部 Tab），切换板块不需要重建页面；
 *   2. 五个端行为完全一致，不依赖各端路由能力，小程序端也能跑；
 *   3. 按压状态可以放在页面层统一持有，保证同一时刻只有一个元素处于按下态。
 *
 * 响应式：pageViewWidth 是响应式字段，PC 拖窗口 / 手机横竖屏切换时，
 * Web 渲染器会把新尺寸透传给页面，attr 块自动重算，vif 自动切换结构。
 */
@Page("home")
class SitePage : Pager() {

    // ------------------------------------------------------------------
    // 状态
    // ------------------------------------------------------------------

    /** 当前板块 */
    private var sectionId: String by observable(Section.Home.id)

    /** 当前被按下的元素 key（同一时刻只有一个） */
    private var pressedKey: String by observable("")

    /** 当前鼠标悬停的元素 key（仅 PC） */
    private var hoveredKey: String by observable("")

    override fun created() {
        super.created()
        // 支持 ?section=about 这样的深链
        val fromParams = pageData.params.optString("section", "")
        if (fromParams.isNotEmpty()) {
            sectionId = Section.fromId(fromParams).id
        }
    }

    // ------------------------------------------------------------------
    // 按压状态：全站唯一的入口
    // ------------------------------------------------------------------

    fun pressStateOf(key: String): PressState = when {
        pressedKey == key -> PressState.Pressed
        hoveredKey == key -> PressState.Hover
        else -> PressState.Idle
    }

    fun pressDown(key: String) {
        pressedKey = key
    }

    fun pressUp(key: String) {
        if (pressedKey == key) pressedKey = ""
    }

    fun hoverIn(key: String) {
        if (pressedKey.isEmpty()) hoveredKey = key
    }

    fun hoverOut(key: String) {
        if (hoveredKey == key) hoveredKey = ""
    }

    // ------------------------------------------------------------------
    // 导航
    // ------------------------------------------------------------------

    fun isActive(id: String): Boolean = sectionId == id

    /** 当前板块 id（供顶栏等组件读取，在 attr {} 里读是响应式的） */
    val currentSectionId: String get() = sectionId

    fun go(id: String) {
        sectionId = id
    }

    fun siteLayout(): SiteLayout = SiteLayout(pageData.pageViewWidth)

    // ------------------------------------------------------------------
    // 视图
    // ------------------------------------------------------------------

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            attr {
                flexDirectionRow()
                // 根视图透明：页面氛围（渐变光斑）由宿主 index.html 的 body 背景承担
                backgroundColor(Color.TRANSPARENT)
                width(ctx.pageData.pageViewWidth)
                height(ctx.pageData.pageViewHeight)
            }

            // PC 宽屏：左侧固定导航
            vif({ ctx.siteLayout().isDesktop }) {
                sideNav(ctx)
            }

            View {
                attr {
                    flex(1f)
                    flexDirectionColumn()
                }

                // 手机 / 平板：顶部标题栏
                vif({ !ctx.siteLayout().isDesktop }) {
                    topBar(ctx)
                }

                Scroller {
                    attr {
                        flex(1f)
                        flexDirectionColumn()
                        showScrollerIndicator(false)
                    }

                    // 居中容器：负责水平居中与左右留白
                    View {
                        attr {
                            val layout = ctx.siteLayout()

                            flexDirectionColumn()
                            alignItemsCenter()
                            // 注意：只给 width，不要再叠加 maxWidth——
                            // H5 端 CSS 里 width 会被 max-width 钳住，
                            // 再经 alignItemsCenter 居中会算出负偏移，
                            // 让正文首字被侧边栏盖住（已踩过的坑）。
                            width(ctx.pageData.pageViewWidth - layout.sideNavWidth)
                            padding(
                                top = layout.verticalPadding,
                                left = layout.gutter,
                                bottom = 0f,
                                right = layout.gutter,
                            )
                        }

                        // 正文列：固定宽度，交给上面的容器居中
                        View {
                            attr {
                                val layout = ctx.siteLayout()
                                val available = ctx.pageData.pageViewWidth -
                                    layout.sideNavWidth -
                                    layout.gutter * 2
                                flexDirectionColumn()
                                width(
                                    if (available <= 0f) layout.contentMaxWidth
                                    else minOf(layout.contentMaxWidth, available)
                                )
                            }
                            ctx.renderSections(this)
                            siteFooter(ctx)
                        }
                    }
                }

                // 手机：底部 Tab 栏
                vif({ ctx.siteLayout().isPhone }) {
                    bottomTabBar(ctx)
                }
            }
        }
    }

    /**
     * 板块切换：用 vif 而不是 when，因为 vif 是响应式的，
     * sectionId 变化时会重建对应板块的视图树。
     */
    private fun renderSections(container: ViewContainer<*, *>) {
        val page = this
        Section.entries.forEach { section ->
            with(container) {
                vif({ page.sectionId == section.id }) {
                    when (section) {
                        Section.Home -> homeSection(page)
                        Section.About -> aboutSection(page)
                        Section.Works -> worksSection(page)
                        Section.Skills -> skillsSection(page)
                        Section.Blog -> blogSection(page)
                        Section.Contact -> contactSection(page)
                    }
                }
            }
        }
    }
}
