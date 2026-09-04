import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';

/// 果冻按钮：按下时弹性缩放（squish）+ 投影联动收缩，松手 elasticOut 回弹
class JellyButton extends StatefulWidget {
  final String? label;
  final Widget? child;
  final Gradient gradient;
  final VoidCallback? onTap;
  final IconData? icon;
  final double height;
  final bool outline;
  final EdgeInsets? padding;

  const JellyButton({
    super.key,
    this.label,
    this.child,
    this.gradient = AppGradients.purplePink,
    this.onTap,
    this.icon,
    this.height = 56,
    this.outline = false,
    this.padding,
  });

  @override
  State<JellyButton> createState() => _JellyButtonState();
}

class _JellyButtonState extends State<JellyButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 420),
  );
  // 按下（forward）用 easeOut 快而稳；松手（reverse）用 elasticOut 大回弹
  late final Animation<double> _scale = Tween<double>(begin: 1.0, end: 0.92)
      .animate(CurvedAnimation(
    parent: _ctrl,
    curve: Curves.easeOut,
    reverseCurve: Curves.elasticOut,
  ));
  bool _pressed = false;

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _down() {
    setState(() => _pressed = true);
    _ctrl.forward();
  }

  void _up() {
    setState(() => _pressed = false);
    _ctrl.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final content = widget.child ??
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.icon != null)
              Icon(widget.icon, color: Colors.white, size: 20),
            if (widget.icon != null && widget.label != null)
              const SizedBox(width: 8),
            if (widget.label != null)
              Text(widget.label!,
                  style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 15)),
          ],
        );

    final radius = BorderRadius.circular(widget.height / 2);
    final decoration = widget.outline
        ? AppTheme.glass(radius: radius, alpha: 0.1)
        : AppTheme.jelly(
            gradient: widget.gradient,
            radius: radius,
            // 按下投影收缩、松手放大，与缩放同步形成"压果冻"深度变化
            elevation: _pressed ? 6 : 20,
          );

    return GestureDetector(
      onTapDown: (_) => _down(),
      onTapUp: (_) {
        _up();
        widget.onTap?.call();
      },
      onTapCancel: _up,
      child: ScaleTransition(
        scale: _scale,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 380),
          curve: _pressed ? Curves.easeOut : Curves.easeOutBack,
          padding: widget.padding ??
              EdgeInsets.symmetric(horizontal: widget.label != null ? 28 : 22),
          height: widget.height,
          decoration: decoration,
          child: Center(child: content),
        ),
      ),
    );
  }
}

/// 果冻体积块（3D 受光果冻体）：径向受光渐变 + 顶部高光斑 + 底部暗弧收口 +
/// 圆角白描边 + 彩色投影，用于把图标块/头像/主圆塑造为圆润立体果冻。
class VolumeBox extends StatelessWidget {
  final Widget? child;
  final Gradient gradient;
  final double radius;
  final double elevation;
  const VolumeBox({
    super.key,
    this.child,
    required this.gradient,
    this.radius = 20,
    this.elevation = 16,
  });

  @override
  Widget build(BuildContext context) {
    final first = gradient.colors.first;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(
            color: Colors.white.withValues(alpha: 0.30), width: 1.4),
        boxShadow: [
          BoxShadow(
            color: first.withValues(alpha: 0.5),
            blurRadius: elevation,
            offset: const Offset(0, 14),
            spreadRadius: -4,
          ),
          const BoxShadow(
            color: Color(0x59FFFFFF),
            blurRadius: 1.5,
            offset: Offset(0, -1),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(radius),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final w = constraints.maxWidth;
            final h = constraints.maxHeight;
            if (w <= 0 || h <= 0) return const SizedBox.shrink();
            return Stack(
              fit: StackFit.expand,
              children: [
                // 底层：受光体积径向渐变（亮顶 → 主色 → 暗底）
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: AppTheme.volumeGradient(gradient),
                  ),
                ),
                // 顶部白色径向高光斑（果冻内发光）
                Align(
                  alignment: const Alignment(-0.62, -0.76),
                  child: Container(
                    width: w * 1.05,
                    height: h * 0.62,
                    decoration: BoxDecoration(
                      gradient: RadialGradient(
                        colors: [
                          Colors.white.withValues(alpha: 0.5),
                          Colors.white.withValues(alpha: 0.0),
                        ],
                        stops: const [0, 1],
                      ),
                    ),
                  ),
                ),
                // 底部暗弧收口（体积感 + 果冻厚度）
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    width: w,
                    height: h * 0.42,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withValues(alpha: 0.0),
                          Colors.black.withValues(alpha: 0.30),
                        ],
                      ),
                    ),
                  ),
                ),
                Center(child: child ?? const SizedBox.shrink()),
              ],
            );
          },
        ),
      ),
    );
  }
}

/// 果冻图标块：3D 受光体积渐变 + 内发光（非扁平渐变贴片）
class JellyIcon extends StatelessWidget {
  final IconData icon;
  final Gradient gradient;
  final double size;
  final double iconScale;

  /// 投影强度（用于 z 轴浮动动画联动：越近越大、越远越小）
  final double elevation;
  const JellyIcon({
    super.key,
    required this.icon,
    this.gradient = AppGradients.purplePink,
    this.size = 54,
    this.iconScale = 0.46,
    this.elevation = 16,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: VolumeBox(
        gradient: gradient,
        radius: size * 0.32,
        elevation: elevation,
        child: Center(
          child: Icon(icon, color: Colors.white, size: size * iconScale),
        ),
      ),
    );
  }
}

/// 真玻璃卡片：ClipRRect + BackdropFilter 背景模糊 + 半透明层，
/// 让动态光斑背景在卡片后产生模糊景深（真正的 glassmorphism）。
class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final double radius;
  final double alpha;
  final double blur;
  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(24),
    this.radius = 28,
    this.alpha = 0.08,
    this.blur = 18,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      // 外投影置于圆角裁剪层之外，避免被 ClipRRect 裁掉
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 26,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(radius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
          child: Container(
            padding: padding,
            decoration: AppTheme.glass(
              radius: BorderRadius.circular(radius),
              alpha: alpha,
              withShadow: false,
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// 渐变文字
class GradientText extends StatelessWidget {
  final String text;
  final double size;
  final FontWeight weight;
  final Gradient gradient;
  const GradientText(
    this.text, {
    super.key,
    this.size = 40,
    this.weight = FontWeight.w800,
    this.gradient = AppGradients.purplePink,
  });

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => gradient.createShader(
        Rect.fromLTWH(0, 0, bounds.width, bounds.height),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: size,
          fontWeight: weight,
          color: Colors.white,
          letterSpacing: 0.5,
          height: 1.1,
        ),
      ),
    );
  }
}
