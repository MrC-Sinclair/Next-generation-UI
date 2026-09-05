import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/projects.dart';
import 'package:flutter_3d_site/widgets/cards.dart';
import 'package:flutter_3d_site/widgets/content_frame.dart';
import 'package:flutter_3d_site/widgets/reveal.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/widgets/section_title.dart';

class PortfolioPage extends StatelessWidget {
  const PortfolioPage({super.key});

  @override
  Widget build(BuildContext context) {
    final desktop = Responsive.isDesktop(context);
    return ContentFrame(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionTitle(kicker: 'Works', title: '作品集'),
          const SizedBox(height: 10),
          const Text('一些我亲手设计与实现的项目，覆盖 Web、移动端、小程序与桌面。',
              style: TextStyle(color: Color(0xFFB6BCE0), fontSize: 15)),
          const SizedBox(height: 28),
          RevealOnLoad(
            child: GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: desktop ? 3 : (Responsive.isMobile(context) ? 1 : 2),
              crossAxisSpacing: 18,
              mainAxisSpacing: 18,
              childAspectRatio: desktop ? 0.94 : 1.0,
              children: projects
                  .map((p) => ProjectCard(project: p))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}
