import 'package:flutter/material.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/app_shell.dart';

void main() {
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
