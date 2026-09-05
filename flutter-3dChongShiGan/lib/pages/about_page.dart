import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/profile.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/content_frame.dart';
import 'package:flutter_3d_site/widgets/jelly.dart';
import 'package:flutter_3d_site/widgets/reveal.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/widgets/section_title.dart';
import 'package:flutter_3d_site/widgets/tilt3d.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    final desktop = Responsive.isDesktop(context);
    return ContentFrame(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionTitle(kicker: 'About', title: '关于我'),
          const SizedBox(height: 28),
          desktop ? _desktopTop(context) : _mobileTop(context),
          const SizedBox(height: 40),
          const SectionTitle(kicker: 'Story', title: '我的经历', gradient: AppGradients.blueCyan),
          const SizedBox(height: 20),
          ...Profile.timeline.map((t) => _timelineItem(t)),
          const SizedBox(height: 40),
          const SectionTitle(kicker: 'Values', title: '我在意的事', gradient: AppGradients.mint),
          const SizedBox(height: 20),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: Profile.values
                .map((v) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      decoration: AppTheme.jelly(
                        gradient: AppGradients.all[
                            Profile.values.indexOf(v) % AppGradients.all.length],
                        radius: BorderRadius.circular(18),
                        elevation: 12,
                      ),
                      child: Text(v,
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 14)),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }

  Widget _desktopTop(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _avatar(),
        const SizedBox(width: 40),
        Expanded(child: _bio()),
      ],
    );
  }

  Widget _mobileTop(BuildContext context) {
    return Column(
      children: [
        Center(child: _avatar()),
        const SizedBox(height: 28),
        _bio(),
      ],
    );
  }

  Widget _avatar() {
    return RevealOnLoad(
      child: Column(
        children: [
          Tilt3D(
            maxAngle: 0.09,
            child: SizedBox(
              width: 180,
              height: 180,
              child: VolumeBox(
                gradient: AppGradients.purplePink,
                radius: 48,
                elevation: 30,
                child: Center(
                  child: Text(Profile.initials,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 76,
                          fontWeight: FontWeight.w800,
                          shadows: [
                            // 首字母下方深色阴影层：凹陷感
                            Shadow(
                              color: Color(0x66000000),
                              blurRadius: 12,
                              offset: Offset(0, 5),
                            ),
                          ])),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(Profile.name,
              style: const TextStyle(
                  color: AppColors.textLight,
                  fontSize: 22,
                  fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(Profile.role,
              style: const TextStyle(color: AppColors.textMuted, fontSize: 14)),
          const SizedBox(height: 8),
          Text(Profile.location,
              style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _bio() {
    return RevealOnLoad(
      delay: const Duration(milliseconds: 120),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: Profile.bio
            .map((p) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Text(p,
                      style: const TextStyle(
                          color: AppColors.textLight,
                          fontSize: 16,
                          height: 1.7)),
                ))
            .toList(),
      ),
    );
  }

  Widget _timelineItem(TimelineItem t) {
    return RevealOnLoad(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 22),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 时间轴
            Column(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: AppTheme.jelly(
                    gradient: AppGradients.blueCyan,
                    radius: BorderRadius.circular(8),
                    elevation: 8,
                  ),
                ),
                Container(
                  width: 2,
                  height: 60,
                  color: Colors.white.withValues(alpha: 0.15),
                ),
              ],
            ),
            const SizedBox(width: 18),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(t.year,
                      style: const TextStyle(
                          color: AppColors.cyan,
                          fontWeight: FontWeight.w800,
                          fontSize: 14)),
                  const SizedBox(height: 4),
                  Text(t.title,
                      style: const TextStyle(
                          color: AppColors.textLight,
                          fontWeight: FontWeight.w700,
                          fontSize: 17)),
                  const SizedBox(height: 4),
                  Text(t.desc,
                      style: const TextStyle(
                          color: AppColors.textMuted, fontSize: 14, height: 1.5)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
