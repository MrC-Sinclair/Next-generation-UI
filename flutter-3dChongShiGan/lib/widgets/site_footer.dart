import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/profile.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';

/// 全站页脚：版权 + 构建说明，收口整页内容，避免"内容戛然而止"的 demo 感。
class SiteFooter extends StatelessWidget {
  final bool desktop;
  const SiteFooter({super.key, required this.desktop});

  @override
  Widget build(BuildContext context) {
    final left = Text(
      '© ${DateTime.now().year} ${Profile.name} · ${Profile.enName}',
      style: const TextStyle(
          color: AppColors.textMuted, fontSize: 12.5, letterSpacing: 0.3),
    );
    final right = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 7,
          height: 7,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: AppGradients.purplePink,
          ),
        ),
        const SizedBox(width: 8),
        const Text(
          '触感 Tactile · 用 Flutter 构建的 3D 果冻设计系统',
          style: TextStyle(
              color: AppColors.textMuted, fontSize: 12.5, letterSpacing: 0.3),
        ),
      ],
    );

    return Padding(
      padding: EdgeInsets.only(top: desktop ? 88 : 64),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 1,
            color: Colors.white.withValues(alpha: 0.08),
          ),
          const SizedBox(height: 22),
          desktop
              ? Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [left, right],
                )
              : Wrap(
                  spacing: 10,
                  runSpacing: 8,
                  alignment: WrapAlignment.center,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [left, right],
                ),
        ],
      ),
    );
  }
}
