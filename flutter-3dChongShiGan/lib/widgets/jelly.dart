import 'dart:ui' show FragmentProgram, FragmentShader, ImageFilter;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/physics.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/tilt3d.dart';

/// 果冻受光体 shader 单例：从 assets/shaders/jelly_shader.frag 编译 FragmentProgram。
/// 加载失败时返回 false，VolumeBox 自动回退到旧的多层装饰渐变方案。
class JellyShaderProgram {
  static FragmentProgram? _program;

  static bool get ready => _program != null;

  static Future<void> ensureLoaded() async {
    if (_program != null) return;
    try {
      _program = await FragmentProgram.fromAsset('assets/shaders/jelly_shader.frag');
    } catch (_) {
      _program = null;
    }
  }

  static FragmentShader buildShader({
    required double width,
    required double height,
    required Gradient gradient,
    double radius = 0,
    Alignment light = const Alignment(-0.35, -0.55),
    double specIntensity = 1.0,
    double fresnel = 0.8,
  }) {
    final p = _program;
    if (p == null) {
      throw StateError('JellyShaderProgram not loaded');
    }
    final shader = p.fragmentShader();
    final colors = gradient.colors;
    final first = colors.isEmpty ? const Color(0xFFA855F7) : colors.first;
    final last = colors.length > 1 ? colors.last : first;
    // 顶部受光色（主色向白轻微提亮）、主体色、暗部收口色
    final topColor = Color.lerp(first, Colors.white, 0.14)!;
    final deepColor = Color.lerp(last, Colors.black, 0.46)!;
    final lx = ((light.x + 1) / 2).clamp(0.0, 1.0);
    final ly = ((light.y + 1) / 2).clamp(0.0, 1.0);
    // uniform 全 vec4，std140 对齐。setFloat 每次写入单个 float slot，
    // 每个 vec4 占用连续 4 个 slot：
    //   uSize   -> 0..3  uColA -> 4..7  uColB -> 8..11
    //   uColC   -> 12..15 uLight -> 16..19
    shader
      ..setFloat(0, width)
      ..setFloat(1, height)
      ..setFloat(2, radius)
      ..setFloat(3, 0)
      ..setFloat(4, topColor.r)
      ..setFloat(5, topColor.g)
      ..setFloat(6, topColor.b)
      ..setFloat(7, 1)
      ..setFloat(8, last.r)
      ..setFloat(9, last.g)
      ..setFloat(10, last.b)
      ..setFloat(11, 1)
      ..setFloat(12, deepColor.r)
      ..setFloat(13, deepColor.g)
      ..setFloat(14, deepColor.b)
      ..setFloat(15, 1)
      ..setFloat(16, lx)
      ..setFloat(17, ly)
      ..setFloat(18, specIntensity)
      ..setFloat(19, fresnel);
    return shader;
  }
}

/// shader 底层绘制（实时光照）：凸透镜高度场 + 偏置点光 + 内阴影 + 镜面高光 + 菲涅尔。
class _JellyShaderPainter extends CustomPainter {
  final FragmentShader shader;
  _JellyShaderPainter(this.shader);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(covariant _JellyShaderPainter oldDelegate) =>
      oldDelegate.shader != shader;
}

/// 果冻按钮：按下弹性缩放（squish）+ 投影联动收缩，松手以二阶弹簧（SpringSimulation）
/// 回弹——产生真实果冻的「过冲—衰减—收敛」振荡，替代固定 elasticOut 曲线。
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
  /// 无界 controller 由 SpringSimulation 驱动；value=0 静止、1 完全按下，
  /// 回弹过程可能短暂过冲为负（轻微放大），收敛后回到目标值。
  late final AnimationController _ctrl =
      AnimationController.unbounded(vsync: this);
  static const SpringDescription _spring =
      SpringDescription(mass: 0.55, stiffness: 320, damping: 24);

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(() {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _run(double target) {
    _ctrl.stop();
    _ctrl.animateWith(SpringSimulation(_spring, _ctrl.value, target, 0));
  }

  void _down() => _run(1.0);

  void _up() {
    _run(0.0);
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
    final v = _ctrl.value; // spring 相位：0 静止 / 1 按下 / 回弹轻微过冲
    final scale = 1 - 0.085 * v;
    final elevation = 20 - 14 * v.clamp(0.0, 1.0);
    final decoration = widget.outline
        ? AppTheme.glass(radius: radius, alpha: 0.1)
        : AppTheme.jelly(
            gradient: widget.gradient,
            radius: radius,
            // 投影随 spring 相位联动：按下收缩、回弹过冲时短暂外扩
            elevation: elevation,
          );

    // Tilt3D：桌面端按钮随鼠标轻微透视倾斜（移动端无 hover 不触发）
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: Tilt3D(
        maxAngle: 0.06,
        child: GestureDetector(
          onTapDown: (_) => _down(),
          onTapUp: (_) {
            _up();
            widget.onTap?.call();
          },
          onTapCancel: _up,
          child: Transform.scale(
            scale: scale,
            child: Container(
              padding: widget.padding ??
                  EdgeInsets.symmetric(
                      horizontal: widget.label != null ? 28 : 22),
              height: widget.height,
              decoration: decoration,
              // widthFactor：让按钮宽度由内容决定，而非撑满父级约束
              child: Center(
                  widthFactor: 1.0, heightFactor: 1.0, child: content),
            ),
          ),
        ),
      ),
    );
  }
}

/// 果冻体积块（3D 受光果冻体）：
/// shader 就绪时 → FragmentShader 实时光照（偏置光源点 + 内阴影近似 +
/// 镜面高光 + 菲涅尔边缘光）；未就绪 → 回退到多层装饰渐变（体积径向渐变 +
/// 顶部高光斑 + 底部暗弧收口 + 白描边 + 彩色投影）。
/// [lightOffset] 可随外置倾斜姿态动态重投影（由 TiltVolumeBox 驱动）。
class VolumeBox extends StatelessWidget {
  final Widget? child;
  final Gradient gradient;
  final double radius;
  final double elevation;
  final Alignment lightOffset;
  final double specIntensity;
  final double fresnel;
  const VolumeBox({
    super.key,
    this.child,
    required this.gradient,
    this.radius = 20,
    this.elevation = 16,
    this.lightOffset = const Alignment(-0.35, -0.55),
    this.specIntensity = 1.0,
    this.fresnel = 0.8,
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
                if (JellyShaderProgram.ready)
                  // 实时光照 shader 层
                  CustomPaint(
                    painter: _JellyShaderPainter(JellyShaderProgram.buildShader(
                      width: w,
                      height: h,
                      gradient: gradient,
                      radius: radius,
                      light: lightOffset,
                      specIntensity: specIntensity,
                      fresnel: fresnel,
                    )),
                  )
                else ...[
                  // 兜底：受光体积径向渐变（亮顶 → 主色 → 暗底）
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: AppTheme.volumeGradient(
                        gradient,
                        light: lightOffset,
                      ),
                    ),
                  ),
                  // 顶部白色径向高光斑（果冻内发光），随 lightOffset 偏置
                  Align(
                    alignment: Alignment(
                        lightOffset.x, (lightOffset.y - 0.21).clamp(-1.0, 1.0)),
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
                ],
                Center(child: child ?? const SizedBox.shrink()),
              ],
            );
          },
        ),
      ),
    );
  }
}

/// 带倾角联动的果冻体积块：自身提供鼠标透视 tilt（Matrix4 透视 rotateX/rotateY），
/// 并将倾角实时折算为光源偏移——hover 时体积块的高光随倾斜方向移动，
/// 实现「高光随倾角动态重投影」。
class TiltVolumeBox extends StatefulWidget {
  final Widget? child;
  final Gradient gradient;
  final double radius;
  final double elevation;
  final Alignment lightOffset;
  final double maxAngle;
  final double perspective;
  final double specIntensity;
  final double fresnel;
  const TiltVolumeBox({
    super.key,
    this.child,
    required this.gradient,
    this.radius = 20,
    this.elevation = 16,
    this.lightOffset = const Alignment(-0.35, -0.55),
    this.maxAngle = 0.10,
    this.perspective = 0.0012,
    this.specIntensity = 1.0,
    this.fresnel = 0.8,
  });

  @override
  State<TiltVolumeBox> createState() => _TiltVolumeBoxState();
}

class _TiltVolumeBoxState extends State<TiltVolumeBox>
    with SingleTickerProviderStateMixin {
  late final Ticker _ticker;
  double _rx = 0;
  double _ry = 0;
  double _tx = 0;
  double _ty = 0;
  Size _size = Size.zero;

  @override
  void initState() {
    super.initState();
    _ticker = createTicker(_onTick)..stop();
  }

  void _onTick(Duration _) {
    const k = 0.16;
    _rx += (_tx - _rx) * k;
    _ry += (_ty - _ry) * k;
    final settled = (_tx - _rx).abs() < 0.0008 && (_ty - _ry).abs() < 0.0008;
    if (settled) {
      _rx = _tx;
      _ry = _ty;
      _ticker.stop();
    }
    if (mounted) setState(() {});
  }

  void _setTarget(double nx, double ny) {
    _tx = nx;
    _ty = ny;
    if (!_ticker.isActive) _ticker.start();
  }

  void _onHover(PointerHoverEvent event) {
    if (_size.isEmpty) return;
    final dx = (event.localPosition.dx - _size.width / 2) / (_size.width / 2);
    final dy = (event.localPosition.dy - _size.height / 2) / (_size.height / 2);
    _setTarget(
      -dy.clamp(-1.0, 1.0).toDouble() * widget.maxAngle,
      dx.clamp(-1.0, 1.0).toDouble() * widget.maxAngle,
    );
  }

  void _onExit(PointerExitEvent event) => _setTarget(0, 0);

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // 倾角（弧度）折算为光源位移：绕 Y 倾侧 → 高光横向移动，绕 X → 纵向移动。
    final shift = widget.maxAngle == 0 ? 0.0 : 0.34 / widget.maxAngle;
    final lightX = (widget.lightOffset.x + _ry * shift).clamp(-1.0, 0.2);
    final lightY = (widget.lightOffset.y - _rx * shift).clamp(-1.0, 1.0);
    return MouseRegion(
      onHover: _onHover,
      onExit: _onExit,
      child: LayoutBuilder(
        builder: (context, constraints) {
          _size = constraints.biggest;
          return Transform(
            alignment: Alignment.center,
            transform: Matrix4.identity()
              ..setEntry(3, 2, widget.perspective)
              ..rotateX(_rx)
              ..rotateY(_ry),
            child: VolumeBox(
              gradient: widget.gradient,
              radius: widget.radius,
              elevation: widget.elevation,
              lightOffset: Alignment(lightX, lightY),
              specIntensity: widget.specIntensity,
              fresnel: widget.fresnel,
              child: widget.child,
            ),
          );
        },
      ),
    );
  }
}

/// 浮雕字形：让 Icon glyph 自身具备体积（凸起雕刻），而非依赖底座。
/// 实现 = 底部错位深影（下凹投影）+ 上亮下暗的渐变字形 + 顶部细亮边。
class EmbossIcon extends StatelessWidget {
  final IconData icon;
  final double size;
  final Color color;
  final double depth;

  const EmbossIcon({
    super.key,
    required this.icon,
    required this.size,
    this.color = Colors.white,
    this.depth = 1.6,
  });

  @override
  Widget build(BuildContext context) {
    final glyph = Icon(icon, size: size, color: color);
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // ① 底部错位深色字形 = 下凹投影（凸起雕刻的暗部）
          Transform.translate(
            offset: Offset(0, depth),
            child: Icon(icon, size: size, color: Colors.black.withValues(alpha: 0.42)),
          ),
          // ② 渐变字形本体：顶部白亮、底部冷灰暗，表现受光凸面
          ShaderMask(
            blendMode: BlendMode.srcIn,
            shaderCallback: (rect) => const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.white, Color(0xFFB7C1F2)],
            ).createShader(rect),
            child: glyph,
          ),
          // ③ 顶部细亮边（轻微上移的白色字形，只透出上半缘）
          Transform.translate(
            offset: Offset(0, -depth * 0.85),
            child: Icon(icon,
                size: size, color: Colors.white.withValues(alpha: 0.20)),
          ),
        ],
      ),
    );
  }
}

/// 果冻图标块：3D 受光体积渐变 + 内发光 + 浮雕立体字形（非扁平渐变贴片）
class JellyIcon extends StatelessWidget {
  final IconData icon;
  final Gradient gradient;
  final double size;
  final double iconScale;

  /// 投影强度（用于 z 轴浮动动画联动：越近越大、越远越小）
  final double elevation;

  /// 字形雕刻类型：true 凸起（default）
  final bool engraved;
  const JellyIcon({
    super.key,
    required this.icon,
    this.gradient = AppGradients.purplePink,
    this.size = 54,
    this.iconScale = 0.46,
    this.elevation = 16,
    this.engraved = false,
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
        lightOffset: const Alignment(-0.35, -0.55),
        child: Center(
          child: EmbossIcon(
            icon: icon,
            size: size * iconScale,
            color: Colors.white,
            depth: size * iconScale * 0.05,
          ),
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
