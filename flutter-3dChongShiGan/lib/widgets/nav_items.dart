import 'package:flutter/material.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';

class NavItem {
  final IconData icon;
  final String label;
  final Gradient gradient;
  const NavItem(
      {required this.icon, required this.label, required this.gradient});
}

const List<NavItem> navItems = [
  NavItem(icon: Icons.home_rounded, label: '首页', gradient: AppGradients.purplePink),
  NavItem(icon: Icons.person_rounded, label: '关于我', gradient: AppGradients.blueCyan),
  NavItem(icon: Icons.work_rounded, label: '作品集', gradient: AppGradients.warm),
  NavItem(icon: Icons.code_rounded, label: '技能栈', gradient: AppGradients.mint),
  NavItem(icon: Icons.article_rounded, label: '博客', gradient: AppGradients.sun),
  NavItem(icon: Icons.mail_rounded, label: '联系', gradient: AppGradients.purplePink),
];
