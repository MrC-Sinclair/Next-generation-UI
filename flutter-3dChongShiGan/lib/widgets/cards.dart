import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/profile.dart';
import 'package:flutter_3d_site/data/projects.dart';
import 'package:flutter_3d_site/data/skills.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/jelly.dart';
import 'package:flutter_3d_site/widgets/nav_items.dart';
import 'package:flutter_3d_site/widgets/reveal.dart';
import 'package:flutter_3d_site/widgets/tilt3d.dart';

/// 数据卡（首页统计）：玻璃卡 + 轻透视 tilt
class StatCard extends StatelessWidget {
  final Stat stat;
  final int index;
  const StatCard({super.key, required this.stat, required this.index});

  @override
  Widget build(BuildContext context) {
    return Tilt3D(
      maxAngle: 0.045,
      child: GlassCard(
        radius: 24,
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GradientText(
              '${stat.value}${stat.suffix}',
              size: 34,
              gradient: AppGradients.all[index % AppGradients.all.length],
            ),
            const SizedBox(height: 6),
            Text(stat.label,
                style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}

/// 快捷入口卡（首页）：鼠标透视 tilt + 果冻图标（浮雕字形）
class QuickLinkCard extends StatelessWidget {
  final NavItem item;
  final VoidCallback onTap;
  const QuickLinkCard({super.key, required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Tilt3D(
        maxAngle: 0.055,
        child: GlassCard(
          radius: 24,
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              JellyIcon(icon: item.icon, gradient: item.gradient, size: 50),
              const SizedBox(width: 16),
              Expanded(
                child: Text(item.label,
                    style: const TextStyle(
                        color: AppColors.textLight,
                        fontWeight: FontWeight.w700,
                        fontSize: 17)),
              ),
              Icon(Icons.arrow_forward_rounded,
                  color: AppColors.textMuted, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

/// 标签胶囊
class TagChip extends StatelessWidget {
  final String label;
  final Gradient gradient;
  const TagChip({super.key, required this.label, this.gradient = AppGradients.purplePink});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: AppTheme.glass(radius: BorderRadius.circular(20), alpha: 0.12),
      child: Text(label,
          style: const TextStyle(color: AppColors.textLight, fontSize: 12)),
    );
  }
}

final List<IconData> _projectIcons = [
  Icons.auto_awesome_rounded,
  Icons.insights_rounded,
  Icons.savings_rounded,
  Icons.edit_note_rounded,
  Icons.view_in_ar_rounded,
  Icons.favorite_rounded,
];

/// 作品卡：玻璃卡 + 鼠标透视 tilt；缩略图中央图标为浮雕字形（非扁平贴片）
class ProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback? onTap;
  const ProjectCard({super.key, required this.project, this.onTap});

  @override
  Widget build(BuildContext context) {
    final grad = AppGradients.all[project.gradientIndex % AppGradients.all.length];
    final icon = _projectIcons[project.gradientIndex % _projectIcons.length];
    return GestureDetector(
      onTap: onTap,
      child: Tilt3D(
        maxAngle: 0.055,
        child: GlassCard(
          radius: 26,
          padding: const EdgeInsets.all(22),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 缩略图（shader 受光果冻 + 浮雕字形）
              SizedBox(
                height: 120,
                child: VolumeBox(
                  gradient: grad,
                  radius: 20,
                  elevation: 16,
                  child: Center(
                    child: EmbossIcon(
                      icon: icon,
                      size: 52,
                      color: Colors.white,
                      depth: 2.2,
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Text(project.title,
                      style: const TextStyle(
                          color: AppColors.textLight,
                          fontWeight: FontWeight.w800,
                          fontSize: 19)),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: AppTheme.glass(radius: BorderRadius.circular(14), alpha: 0.1),
                  child: Text(project.metric,
                      style: const TextStyle(
                          color: AppColors.textLight, fontSize: 11)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(project.desc,
                style: const TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.5),
                maxLines: 3,
                overflow: TextOverflow.ellipsis),
            const SizedBox(height: 14),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: project.tags
                  .map((t) => TagChip(label: t, gradient: grad))
                  .toList(),
            ),
          ],
        ),
        ),
      ),
    );
  }
}

/// 技能进度条（果冻风）
class SkillBar extends StatelessWidget {
  final Skill skill;
  final Gradient gradient;
  const SkillBar({super.key, required this.skill, required this.gradient});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(skill.name,
                style: const TextStyle(color: AppColors.textLight, fontSize: 14)),
            Text('${(skill.level * 100).toInt()}%',
                style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          height: 12,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(10),
          ),
          child: LayoutBuilder(
            builder: (ctx, constraints) => RevealOnLoad(
              duration: const Duration(milliseconds: 900),
              child: Container(
                width: constraints.maxWidth * skill.level,
                decoration: AppTheme.jelly(
                  gradient: gradient,
                  radius: BorderRadius.circular(10),
                  elevation: 8,
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
