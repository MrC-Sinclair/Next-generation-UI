import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/skills.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/cards.dart';
import 'package:flutter_3d_site/widgets/content_frame.dart';
import 'package:flutter_3d_site/widgets/jelly.dart';
import 'package:flutter_3d_site/widgets/reveal.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/widgets/section_title.dart';

class SkillsPage extends StatelessWidget {
  const SkillsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final desktop = Responsive.isDesktop(context);
    return ContentFrame(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionTitle(kicker: 'Skills', title: '技能栈'),
          const SizedBox(height: 10),
          const Text('不只是会用什么，更在意用得多好。',
              style: TextStyle(color: Color(0xFFB6BCE0), fontSize: 15)),
          const SizedBox(height: 28),
          RevealOnLoad(
            child: GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: desktop ? 2 : 1,
              crossAxisSpacing: 20,
              mainAxisSpacing: 20,
              childAspectRatio: desktop ? 1.25 : 1.7,
              children: skillCategories.map((cat) => _categoryCard(cat)).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _categoryCard(SkillCategory cat) {
    final grad = AppGradients.all[cat.gradientIndex % AppGradients.all.length];
    return GlassCard(
      radius: 26,
      padding: const EdgeInsets.all(26),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              JellyIcon(
                icon: Icons.star_rounded,
                gradient: grad,
                size: 42,
                iconScale: 0.5,
              ),
              const SizedBox(width: 12),
              Text(cat.name,
                  style: const TextStyle(
                      color: AppColors.textLight,
                      fontWeight: FontWeight.w800,
                      fontSize: 18)),
            ],
          ),
          const SizedBox(height: 18),
          ...cat.skills.map((s) => SkillBar(skill: s, gradient: grad)),
        ],
      ),
    );
  }
}
