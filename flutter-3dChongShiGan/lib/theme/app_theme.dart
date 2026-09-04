import 'package:flutter/material.dart';

/// 设计系统：3D 果冻 / 充实质感 视觉语言
/// 主色：紫 → 粉 糖果渐变；深色背景让果冻元素更突出。
class AppColors {
  // 主果冻色
  static const violet = Color(0xFF8B5CF6);
  static const pink = Color(0xFFEC4899);
  static const cyan = Color(0xFF22D3EE);
  static const amber = Color(0xFFF59E0B);
  static const mint = Color(0xFF34D399);

  // 背景
  static const bgTop = Color(0xFF241B4E);
  static const bgBottom = Color(0xFF0E0A26);

  // 文字
  static const textLight = Color(0xFFF8FAFC);
  static const textMuted = Color(0xFFB6BCE0);
}

class AppGradients {
  static const purplePink = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFA855F7), Color(0xFFEC4899)],
  );
  static const blueCyan = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF6366F1), Color(0xFF22D3EE)],
  );
  static const warm = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF472B6), Color(0xFFFB923C)],
  );
  static const mint = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF34D399), Color(0xFF22D3EE)],
  );
  static const sun = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFFBBF24), Color(0xFFFB7185)],
  );
  static const grape = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
  );

  static List<LinearGradient> get all =>
      [purplePink, blueCyan, warm, mint, sun, grape];
}

class AppTheme {
  static ThemeData get theme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.transparent,
        colorScheme: ColorScheme.dark(
          primary: AppColors.violet,
          secondary: AppColors.pink,
          surface: Colors.white.withValues(alpha: 0.06),
        ),
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: AppColors.textLight, fontSize: 16, height: 1.6),
          bodySmall: TextStyle(color: AppColors.textMuted, fontSize: 14, height: 1.5),
        ),
        fontFamily: 'SimHei',
      );

  /// 体积径向渐变：由线性渐变派生"亮顶 → 主色 → 暗底"的受光体积渐变，
  /// 用于把平面渐变块塑造为 3D 果冻受光体。
  static RadialGradient volumeGradient(Gradient gradient) {
    final colors = gradient.colors;
    final begin = colors.isEmpty ? const Color(0xFFA855F7) : colors.first;
    final end = colors.length > 1 ? colors.last : begin;
    return RadialGradient(
      center: const Alignment(-0.35, -0.55),
      radius: 1.15,
      colors: [
        // 亮顶（提亮主色）
        Color.lerp(begin, Colors.white, 0.38)!,
        begin,
        end,
        // 暗底（收口）
        Color.lerp(end, Colors.black, 0.42)!,
      ],
      stops: const [0, 0.42, 0.78, 1.0],
    );
  }

  /// 果冻质感装饰：渐变 + 大圆角 + 投影 + 顶部高光描边
  static BoxDecoration jelly({
    Gradient? gradient,
    BorderRadius? radius,
    double elevation = 22,
    Color? baseColor,
  }) {
    final Color first =
        gradient?.colors.first ?? baseColor ?? AppColors.violet;
    return BoxDecoration(
      gradient: gradient,
      color: gradient == null ? baseColor : null,
      borderRadius: radius ?? BorderRadius.circular(28),
      border: Border.all(color: Colors.white.withValues(alpha: 0.28), width: 1.5),
      boxShadow: [
        BoxShadow(
          color: first.withValues(alpha: 0.45),
          blurRadius: elevation,
          offset: const Offset(0, 14),
          spreadRadius: -6,
        ),
        const BoxShadow(
          color: Color(0x40FFFFFF),
          blurRadius: 1,
          offset: Offset(0, -1.5),
        ),
      ],
    );
  }

  /// 玻璃拟态装饰
  static BoxDecoration glass({
    BorderRadius? radius,
    double alpha = 0.08,
    bool withShadow = true,
  }) {
    return BoxDecoration(
      color: Colors.white.withValues(alpha: alpha),
      borderRadius: radius ?? BorderRadius.circular(28),
      border: Border.all(color: Colors.white.withValues(alpha: 0.16)),
      boxShadow: withShadow
          ? [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.28),
                blurRadius: 26,
                offset: const Offset(0, 14),
              ),
            ]
          : null,
    );
  }
}
