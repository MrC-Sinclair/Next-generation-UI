import 'package:flutter/material.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/widgets/site_footer.dart';

/// 统一内容容器：滚动 + 居中限宽 + 响应式边距 + 全站页脚
class ContentFrame extends StatelessWidget {
  final Widget child;
  final double top;
  final double bottom;
  final bool showFooter;
  const ContentFrame({
    super.key,
    required this.child,
    this.top = 28,
    this.bottom = 56,
    this.showFooter = true,
  });

  @override
  Widget build(BuildContext context) {
    final pad = Responsive.horizontalPadding(context);
    final desktop = Responsive.isDesktop(context);
    final topPad = top + (desktop ? 0 : 64);
    return SingleChildScrollView(
      child: Center(
        child: Container(
          constraints: BoxConstraints(maxWidth: Responsive.maxWidth(context)),
          padding: EdgeInsets.fromLTRB(pad, topPad, pad, bottom),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              child,
              if (showFooter) SiteFooter(desktop: desktop),
            ],
          ),
        ),
      ),
    );
  }
}
