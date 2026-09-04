import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

/// 3D tilt 交互：跟随鼠标在元素内的位置，对子元素做 Matrix4 透视
/// rotateX / rotateY 微倾侧；指针离开后平滑复位，制造「浮在空中的果冻」效果。
class Tilt3D extends StatefulWidget {
  final Widget child;
  final double maxAngle; // 最大倾角（弧度）
  final double perspective; // 透视强度（setEntry(3,2) 倒数）
  const Tilt3D({
    super.key,
    required this.child,
    this.maxAngle = 0.12,
    this.perspective = 0.0012,
  });

  @override
  State<Tilt3D> createState() => _Tilt3DState();
}

class _Tilt3DState extends State<Tilt3D> with SingleTickerProviderStateMixin {
  late final Ticker _ticker;
  double _rx = 0;
  double _ry = 0; // 当前角度
  double _tx = 0;
  double _ty = 0; // 目标角度
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
    final settled =
        (_tx - _rx).abs() < 0.0008 && (_ty - _ry).abs() < 0.0008;
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
            child: widget.child,
          );
        },
      ),
    );
  }
}
