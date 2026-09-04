import 'package:flutter/material.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';

/// 统一内容容器：滚动 + 居中限宽 + 响应式边距
class ContentFrame extends StatelessWidget {
  final Widget child;
  final double top;
  final double bottom;
  const ContentFrame({
    super.key,
    required this.child,
    this.top = 28,
    this.bottom = 56,
  });

  @override
  Widget build(BuildContext context) {
    final pad = Responsive.horizontalPadding(context);
    final topPad = top + (Responsive.isDesktop(context) ? 0 : 64);
    return SingleChildScrollView(
      child: Center(
        child: Container(
          constraints: BoxConstraints(maxWidth: Responsive.maxWidth(context)),
          padding: EdgeInsets.fromLTRB(pad, topPad, pad, bottom),
          child: child,
        ),
      ),
    );
  }
}
