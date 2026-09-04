import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/profile.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/blob_background.dart';
import 'package:flutter_3d_site/widgets/nav_items.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/pages/home_page.dart';
import 'package:flutter_3d_site/pages/about_page.dart';
import 'package:flutter_3d_site/pages/portfolio_page.dart';
import 'package:flutter_3d_site/pages/skills_page.dart';
import 'package:flutter_3d_site/pages/blog_page.dart';
import 'package:flutter_3d_site/pages/contact_page.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  void _go(int i) => setState(() => _index = i);

  @override
  Widget build(BuildContext context) {
    final desktop = Responsive.isDesktop(context);
    final pages = <Widget>[
      HomePage(onNavigate: _go),
      const AboutPage(),
      const PortfolioPage(),
      const SkillsPage(),
      const BlogPage(),
      const ContactPage(),
    ];

    final body = AnimatedSwitcher(
      duration: const Duration(milliseconds: 320),
      transitionBuilder: (child, anim) =>
          FadeTransition(opacity: anim, child: child),
      child: KeyedSubtree(
        key: ValueKey(_index),
        child: pages[_index],
      ),
    );

    return Scaffold(
      backgroundColor: Colors.transparent,
      extendBodyBehindAppBar: true,
      appBar: desktop
          ? null
          : AppBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              title: _brand(compact: true),
              iconTheme: const IconThemeData(color: AppColors.textLight),
            ),
      drawer: desktop
          ? null
          : Drawer(
              backgroundColor: AppColors.bgBottom,
              child: SafeArea(child: _drawerContent()),
            ),
      bottomNavigationBar: desktop ? null : _bottomNav(),
      body: Stack(
        children: [
          const Positioned.fill(child: BlobBackground()),
          Row(
            children: [
              if (desktop) _sidebar(),
              Expanded(
                child: body,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _sidebar() {
    return Container(
      width: 272,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.04),
        border: Border(
            right: BorderSide(color: Colors.white.withValues(alpha: 0.08))),
      ),
      padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 18),
      child: Column(
        children: [
          _brand(),
          const SizedBox(height: 30),
          ...List.generate(navItems.length, (i) => _sideItem(i)),
          const Spacer(),
          _socialRow(),
        ],
      ),
    );
  }

  Widget _drawerContent() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _brand(),
          const SizedBox(height: 28),
          ...List.generate(navItems.length, (i) => _sideItem(i)),
          const Spacer(),
          _socialRow(),
        ],
      ),
    );
  }

  Widget _sideItem(int i) {
    final active = _index == i;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: GestureDetector(
        onTap: () => _go(i),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
          decoration: active
              ? AppTheme.jelly(
                  gradient: navItems[i].gradient,
                  radius: BorderRadius.circular(18),
                  elevation: 14,
                )
              : BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(18),
                ),
          child: Row(
            children: [
              Icon(navItems[i].icon,
                  color: active ? Colors.white : AppColors.textMuted, size: 22),
              const SizedBox(width: 14),
              Text(navItems[i].label,
                  style: TextStyle(
                    color: active ? Colors.white : AppColors.textMuted,
                    fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 15,
                  )),
            ],
          ),
        ),
      ),
    );
  }

  Widget _bottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.35),
        border: Border(
            top: BorderSide(color: Colors.white.withValues(alpha: 0.1))),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(navItems.length, (i) {
              final active = _index == i;
              return GestureDetector(
                onTap: () => _go(i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: active
                      ? AppTheme.jelly(
                          gradient: navItems[i].gradient,
                          radius: BorderRadius.circular(16),
                          elevation: 10,
                        )
                      : const BoxDecoration(),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(navItems[i].icon,
                          color: active ? Colors.white : AppColors.textMuted,
                          size: 22),
                      const SizedBox(height: 3),
                      Text(navItems[i].label,
                          style: TextStyle(
                            color: active ? Colors.white : AppColors.textMuted,
                            fontSize: 11,
                            fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                          )),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  Widget _socialRow() {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: Profile.socials.map((s) {
        return Container(
          width: 42,
          height: 42,
          decoration: AppTheme.glass(radius: BorderRadius.circular(14), alpha: 0.1),
          child: Center(child: Icon(s.icon, color: AppColors.textLight, size: 20)),
        );
      }).toList(),
    );
  }

  Widget _brand({bool compact = false}) {
    final logo = Container(
      width: compact ? 40 : 48,
      height: compact ? 40 : 48,
      decoration: AppTheme.jelly(
        gradient: AppGradients.purplePink,
        radius: BorderRadius.circular(compact ? 12 : 16),
        elevation: 14,
      ),
      child: Center(
        child: Text(Profile.initials,
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w800,
                fontSize: compact ? 20 : 24)),
      ),
    );
    if (compact) {
      return Row(
        children: [
          logo,
          const SizedBox(width: 12),
          Text(Profile.name,
              style: const TextStyle(
                  color: AppColors.textLight,
                  fontWeight: FontWeight.w800,
                  fontSize: 18)),
        ],
      );
    }
    return Row(
      children: [
        logo,
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(Profile.name,
                style: const TextStyle(
                    color: AppColors.textLight,
                    fontWeight: FontWeight.w800,
                    fontSize: 18)),
            const Text('Personal Site',
                style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
          ],
        ),
      ],
    );
  }
}
