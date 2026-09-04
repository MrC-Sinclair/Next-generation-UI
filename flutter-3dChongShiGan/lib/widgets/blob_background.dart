import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';

/// 动态渐变光斑背景，营造「充实质感」与深度
class BlobBackground extends StatefulWidget {
  const BlobBackground({super.key});

  @override
  State<BlobBackground> createState() => _BlobBackgroundState();
}

class _BlobBackgroundState extends State<BlobBackground>
    with TickerProviderStateMixin {
  late final Ticker _ticker;
  double _t = 0;

  @override
  void initState() {
    super.initState();
    _ticker = Ticker((_) {
      _t += 0.006;
      if (mounted) setState(() {});
    });
    _ticker.start();
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Stack(
      children: [
        // 基础深色渐变
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [AppColors.bgTop, AppColors.bgBottom],
            ),
          ),
        ),
        _blob(size.width * 0.18 + sin(_t * 0.6) * 40,
            size.height * 0.18 + cos(_t * 0.5) * 36, 360, Colors.purpleAccent),
        _blob(size.width * 0.85 + cos(_t * 0.4) * 50,
            size.height * 0.30 + sin(_t * 0.55) * 40, 420, Colors.pinkAccent),
        _blob(size.width * 0.55 + sin(_t * 0.35) * 60,
            size.height * 0.85 + cos(_t * 0.45) * 40, 480, Colors.cyanAccent),
        // 轻微暗角
        Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: Alignment.center,
              radius: 1.1,
              colors: [Colors.transparent, Colors.black.withValues(alpha: 0.35)],
            ),
          ),
        ),
      ],
    );
  }

  Widget _blob(double x, double y, double size, Color color) {
    return Positioned(
      left: x - size / 2,
      top: y - size / 2,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [
              color.withValues(alpha: 0.55),
              color.withValues(alpha: 0.0),
            ],
            stops: const [0.0, 1.0],
          ),
        ),
      ),
    );
  }
}
