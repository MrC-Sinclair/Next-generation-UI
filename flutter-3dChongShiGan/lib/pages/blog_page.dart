import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/posts.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/cards.dart';
import 'package:flutter_3d_site/widgets/content_frame.dart';
import 'package:flutter_3d_site/widgets/jelly.dart';
import 'package:flutter_3d_site/widgets/reveal.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/widgets/section_title.dart';
import 'package:flutter_3d_site/widgets/tilt3d.dart';

class BlogPage extends StatelessWidget {
  const BlogPage({super.key});

  @override
  Widget build(BuildContext context) {
    final desktop = Responsive.isDesktop(context);
    return ContentFrame(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionTitle(kicker: 'Blog', title: '博客'),
          const SizedBox(height: 10),
          const Text('关于动效、设计与工程的零碎思考。',
              style: TextStyle(color: Color(0xFFB6BCE0), fontSize: 15)),
          const SizedBox(height: 28),
          RevealOnLoad(
            child: GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: desktop ? 2 : 1,
              crossAxisSpacing: 18,
              mainAxisSpacing: 18,
              childAspectRatio: desktop ? 1.5 : 1.2,
              children: posts.map((p) => _postCard(context, p)).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _postCard(BuildContext context, Post post) {
    final grad = AppGradients.all[post.gradientIndex % AppGradients.all.length];
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => _openPost(context, post),
        child: Tilt3D(
          maxAngle: 0.055,
          child: GlassCard(
            radius: 26,
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: AppTheme.jelly(
                        gradient: grad,
                        radius: BorderRadius.circular(16),
                        elevation: 8,
                      ),
                      child: Text(post.readTime,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w700)),
                    ),
                    const Spacer(),
                    Text(post.date,
                        style: const TextStyle(
                            color: AppColors.textMuted, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 16),
                Text(post.title,
                    style: const TextStyle(
                        color: AppColors.textLight,
                        fontWeight: FontWeight.w800,
                        fontSize: 19,
                        height: 1.3)),
                const SizedBox(height: 10),
                Expanded(
                  child: Text(post.excerpt,
                      style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 13,
                          height: 1.5),
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: post.tags
                      .map((t) => TagChip(label: t, gradient: grad))
                      .toList(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _openPost(BuildContext context, Post post) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.6),
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(20),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 720),
          child: GlassCard(
            radius: 28,
            alpha: 0.12,
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(post.date,
                        style: const TextStyle(
                            color: AppColors.textMuted, fontSize: 13)),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close_rounded,
                          color: AppColors.textLight),
                      onPressed: () => Navigator.of(ctx).pop(),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(post.title,
                    style: const TextStyle(
                        color: AppColors.textLight,
                        fontWeight: FontWeight.w800,
                        fontSize: 26,
                        height: 1.25)),
                const SizedBox(height: 16),
                Flexible(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: _renderBody(post.body),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 8,
                  children: post.tags
                      .map((t) => TagChip(label: t))
                      .toList(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _renderBody(String body) {
    return body.split('\n').where((l) => l.trim().isNotEmpty).map((line) {
      final t = line.trim();
      if (t.startsWith('## ')) {
        return Padding(
          padding: const EdgeInsets.only(top: 16, bottom: 6),
          child: Text(t.substring(3),
              style: const TextStyle(
                  color: AppColors.textLight,
                  fontWeight: FontWeight.w800,
                  fontSize: 18)),
        );
      }
      if (t.startsWith('# ')) {
        return Padding(
          padding: const EdgeInsets.only(top: 8, bottom: 8),
          child: Text(t.substring(2),
              style: const TextStyle(
                  color: AppColors.textLight,
                  fontWeight: FontWeight.w800,
                  fontSize: 22)),
        );
      }
      if (t.startsWith('- ')) {
        return Padding(
          padding: const EdgeInsets.only(left: 8, bottom: 6),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.only(top: 9, right: 8),
                child: Icon(Icons.circle, size: 6, color: AppColors.pink),
              ),
              Expanded(
                child: Text(t.substring(2),
                    style: const TextStyle(
                        color: AppColors.textLight, fontSize: 15, height: 1.6)),
              ),
            ],
          ),
        );
      }
      return Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Text(t,
            style: const TextStyle(
                color: AppColors.textLight, fontSize: 15, height: 1.7)),
      );
    }).toList();
  }
}
