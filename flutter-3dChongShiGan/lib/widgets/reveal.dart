import 'package:flutter/material.dart';

/// 入场动画：淡入 + 轻微上移
class RevealOnLoad extends StatefulWidget {
  final Widget child;
  final Duration delay;
  final Offset offset;
  final Duration duration;
  const RevealOnLoad({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.offset = const Offset(0, 0.06),
    this.duration = const Duration(milliseconds: 600),
  });

  @override
  State<RevealOnLoad> createState() => _RevealOnLoadState();
}

class _RevealOnLoadState extends State<RevealOnLoad>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: widget.duration);
  late final Animation<double> _op =
      CurvedAnimation(parent: _c, curve: Curves.easeOut);
  late final Animation<Offset> _pos = Tween<Offset>(
          begin: widget.offset, end: Offset.zero)
      .animate(CurvedAnimation(parent: _c, curve: Curves.easeOutCubic));

  @override
  void initState() {
    super.initState();
    Future.delayed(widget.delay, () {
      if (mounted) _c.forward();
    });
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _op,
      child: SlideTransition(position: _pos, child: widget.child),
    );
  }
}
