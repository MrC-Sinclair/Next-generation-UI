import 'package:flutter/material.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/app_shell.dart';
import 'package:flutter_3d_site/widgets/jelly.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // 预编译果冻受光体 fragment shader；失败时 VolumeBox 自动回退多层渐变装饰
  await JellyShaderProgram.ensureLoaded();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '触感 · 个人主页',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: const AppShell(),
    );
  }
}
