import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/profile.dart';
import 'package:flutter_3d_site/data/projects.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/cards.dart';
import 'package:flutter_3d_site/widgets/content_frame.dart';
import 'package:flutter_3d_site/widgets/jelly.dart';
import 'package:flutter_3d_site/widgets/nav_items.dart';
import 'package:flutter_3d_site/widgets/reveal.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/widgets/section_title.dart';
import 'package:flutter_3d_site/widgets/tilt3d.dart';

class HomePage extends StatelessWidget {
  final void Function(int) onNavigate;
  const HomePage({super.key, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final desktop = Responsive.isDesktop(context);
    return ContentFrame(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero
          desktop ? _heroDesktop(context) : _heroMobile(context),
          const SizedBox(height: 56),

          // 统计
          RevealOnLoad(
            child: GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: desktop ? 4 : 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: desktop ? 1.6 : 1.4,
              children: List.generate(
                Profile.stats.length,
                (i) => StatCard(stat: Profile.stats[i], index: i),
              ),
            ),
          ),
          const SizedBox(height: 56),

          // 快捷入口
          const SectionTitle(kicker: 'Explore', title: '想去哪儿看看？'),
          const SizedBox(height: 24),
          RevealOnLoad(
            delay: const Duration(milliseconds: 100),
            child: GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: desktop ? 3 : 1,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: desktop ? 3.4 : 5.2,
              children: List.generate(navItems.length - 1, (k) {
                final i = k + 1; // 跳过首页自身，避免栅格留白
                return QuickLinkCard(
                  item: navItems[i],
                  onTap: () => onNavigate(i),
                );
              }),
            ),
          ),
          const SizedBox(height: 56),

          // 精选作品
          SectionTitle(
            kicker: 'Featured',
            title: '精选作品',
            gradient: AppGradients.warm,
          ),
          const SizedBox(height: 24),
          RevealOnLoad(
            delay: const Duration(milliseconds: 100),
            child: GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: desktop ? 3 : 1,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: desktop ? 0.94 : 0.95,
              children: List.generate(3, (i) {
                return ProjectCard(
                  project: projects[i],
                  onTap: () => onNavigate(2),
                );
              }),
            ),
          ),
          const SizedBox(height: 24),
          Center(
            child: JellyButton(
              label: '查看全部作品',
              icon: Icons.arrow_forward_rounded,
              gradient: AppGradients.warm,
              onTap: () => onNavigate(2),
            ),
          ),
        ],
      ),
    );
  }

  Widget _heroDesktop(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(child: _heroText(context)),
        const SizedBox(width: 48),
        const Expanded(child: _HeroVisual()),
      ],
    );
  }

  Widget _heroMobile(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _heroText(context),
        const SizedBox(height: 36),
        const Center(child: _HeroVisual()),
      ],
    );
  }

  Widget _heroText(BuildContext context) {
    return RevealOnLoad(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
            decoration: AppTheme.glass(radius: BorderRadius.circular(20), alpha: 0.1),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.waving_hand_rounded, color: AppColors.amber, size: 16),
                SizedBox(width: 8),
                Text('你好，我是',
                    style: TextStyle(color: AppColors.textLight, fontSize: 14)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          GradientText(Profile.name, size: 64),
          const SizedBox(height: 10),
          Text(Profile.role,
              style: const TextStyle(
                  color: AppColors.textLight,
                  fontSize: 20,
                  fontWeight: FontWeight.w600)),
          const SizedBox(height: 18),
          Text(Profile.tagline,
              style: const TextStyle(
                  color: AppColors.textMuted, fontSize: 16, height: 1.6)),
          const SizedBox(height: 30),
          Wrap(
            spacing: 14,
            runSpacing: 14,
            children: [
              JellyButton(
                label: '查看作品集',
                icon: Icons.work_rounded,
                onTap: () => onNavigate(2),
              ),
              JellyButton(
                label: '联系我',
                icon: Icons.mail_rounded,
                outline: true,
                onTap: () => onNavigate(5),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// 首页视觉：果冻头像 + 漂浮图标
class _HeroVisual extends StatelessWidget {
  const _HeroVisual();

  @override
  Widget build(BuildContext context) {
    return RevealOnLoad(
      delay: const Duration(milliseconds: 150),
      child: SizedBox(
        height: 360,
        child: Stack(
          alignment: Alignment.center,
          children: [
            // 主圆（球体化：径向体积渐变 + 顶部高光斑 + 首字母下方深色阴影层）
            Tilt3D(
              maxAngle: 0.10,
              child: SizedBox(
                width: 220,
                height: 220,
                child: VolumeBox(
                  gradient: AppGradients.purplePink,
                  radius: 60,
                  elevation: 34,
                  child: Center(
                    child: Text(Profile.initials,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 90,
                            fontWeight: FontWeight.w800,
                            shadows: [
                              // 首字母下方深色阴影层：凹陷进果冻的暗示
                              Shadow(
                                color: Color(0x66000000),
                                blurRadius: 14,
                                offset: Offset(0, 6),
                              ),
                              // 顶部细亮边：立体鼓起
                              Shadow(
                                color: Color(0x80FFFFFF),
                                blurRadius: 1,
                                offset: Offset(0, -1),
                              ),
                            ])),
                  ),
                ),
              ),
            ),
            // 漂浮元素：Positioned 必须是 Stack 的直接子级，动画包装在内部
            Positioned(
              top: 10,
              left: 8,
              child: _FloatingIcon(
                builder: (s) => Tilt3D(
                  maxAngle: 0.06,
                  child: JellyIcon(
                    icon: Icons.code_rounded,
                    gradient: AppGradients.blueCyan,
                    size: 64,
                    elevation: 8 + 18 * s,
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              right: 4,
              child: _FloatingIcon(
                duration: const Duration(milliseconds: 4200),
                builder: (s) => Tilt3D(
                  maxAngle: 0.06,
                  child: JellyIcon(
                    icon: Icons.brush_rounded,
                    gradient: AppGradients.warm,
                    size: 58,
                    elevation: 8 + 15 * s,
                  ),
                ),
              ),
            ),
            Positioned(
              top: 40,
              right: 0,
              child: _FloatingIcon(
                duration: const Duration(milliseconds: 3000),
                builder: (s) => Tilt3D(
                  maxAngle: 0.06,
                  child: JellyIcon(
                    icon: Icons.coffee_rounded,
                    gradient: AppGradients.sun,
                    size: 52,
                    elevation: 8 + 14 * s,
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 4,
              left: 24,
              child: _FloatingIcon(
                duration: const Duration(milliseconds: 5000),
                builder: (s) => Tilt3D(
                  maxAngle: 0.06,
                  child: JellyIcon(
                    icon: Icons.auto_awesome_rounded,
                    gradient: AppGradients.mint,
                    size: 48,
                    elevation: 8 + 13 * s,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 漂浮图标：持续的 z 轴呼吸动画 —— 纵向位移与缩放联动（近大远小），
/// 同时驱动图标投影大小（越近投影越大越实、越远越小越淡），
/// 视觉上像果冻球体在玻璃层前浮沉。
class _FloatingIcon extends StatefulWidget {
  /// 每帧构建内容，s 为呼吸相位 0..1（1 时最"近"）
  final Widget Function(double s) builder;
  final Duration duration;
  const _FloatingIcon({
    required this.builder,
    this.duration = const Duration(milliseconds: 3600),
  });

  @override
  State<_FloatingIcon> createState() => _FloatingIconState();
}

class _FloatingIconState extends State<_FloatingIcon>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: widget.duration,
  )..repeat(reverse: true);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        final v = _controller.value; // 0..1 往复
        final s = math.sin(v * math.pi); // 0→1→0
        final dy = -12 * s; // 上浮最高点对应 s=1
        final scale = 1 + 0.05 * s; // 近大远小
        return Transform.translate(
          offset: Offset(0, dy),
          child: Transform.scale(scale: scale, child: widget.builder(s)),
        );
      },
    );
  }
}
