import 'package:flutter/material.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';

/// 段落标题：小标签 + 大标题 + 渐变下划线
class SectionTitle extends StatelessWidget {
  final String kicker;
  final String title;
  final Gradient gradient;
  final bool center;
  const SectionTitle({
    super.key,
    required this.kicker,
    required this.title,
    this.gradient = AppGradients.purplePink,
    this.center = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment:
          center ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.18)),
          ),
          child: Text(
            kicker.toUpperCase(),
            style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.5),
          ),
        ),
        const SizedBox(height: 14),
        Text(
          title,
          style: TextStyle(
            fontSize: 30,
            fontWeight: FontWeight.w800,
            color: AppColors.textLight,
            height: 1.15,
          ),
          textAlign: center ? TextAlign.center : TextAlign.start,
        ),
        const SizedBox(height: 12),
        Container(
          width: 64,
          height: 5, decoration: AppTheme.jelly(gradient: gradient, radius: BorderRadius.circular(4), elevation: 8),
        ),
      ],
    );
  }
}
