import 'package:flutter/material.dart';

/// 响应式断点工具（针对 H5 / Web 多尺寸）
class Responsive {
  static bool isDesktop(BuildContext c) =>
      MediaQuery.of(c).size.width >= 1000;
  static bool isTablet(BuildContext c) {
    final w = MediaQuery.of(c).size.width;
    return w >= 640 && w < 1000;
  }

  static bool isMobile(BuildContext c) => MediaQuery.of(c).size.width < 640;

  /// 内容最大宽度（居中限宽）
  static double maxWidth(BuildContext c) =>
      MediaQuery.of(c).size.width.clamp(0, 1180);

  /// 根据宽度返回横向内边距
  static double horizontalPadding(BuildContext c) {
    final w = MediaQuery.of(c).size.width;
    if (w >= 1000) return 48;
    if (w >= 640) return 32;
    return 20;
  }
}
