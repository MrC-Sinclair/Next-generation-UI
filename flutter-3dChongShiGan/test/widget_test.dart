// 个人主页 Widget 测试：首页冒烟 + 底部导航切换。
// 注意：首页存在持续运行的背景动画（BlobBackground Ticker），
// 因此统一使用 pump 固定时长推进，禁止 pumpAndSettle（会超时）。

import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_3d_site/main.dart';
import 'package:flutter_3d_site/data/profile.dart';

void main() {
  testWidgets('首页冒烟：品牌与主内容渲染', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pump(const Duration(milliseconds: 800));

    // 品牌信息（Hero + 侧栏/顶栏品牌均会出现）
    expect(find.text(Profile.role), findsOneWidget);
    // 首页区块
    expect(find.text('精选作品'), findsOneWidget);
    expect(find.text('查看全部作品'), findsOneWidget);
    // 底部导航存在
    expect(find.text('首页'), findsWidgets);

    // 推进以触发所有 RevealOnLoad 的延迟动画，避免遗留 pending timer
    await tester.pump(const Duration(seconds: 1));
  });

  testWidgets('底部导航可切换到各主页面', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pump(const Duration(milliseconds: 800));

    // 作品集
    await tester.tap(find.text('作品集').last);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('一些我亲手设计与实现的项目，覆盖 Web、移动端、小程序与桌面。'),
        findsOneWidget);

    // 博客
    await tester.tap(find.text('博客').last);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('关于动效、设计与工程的零碎思考。'), findsOneWidget);

    // 联系
    await tester.tap(find.text('联系').last);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('给我留言'), findsOneWidget);

    // 关于我
    await tester.tap(find.text('关于我').last);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('我在意的事'), findsOneWidget);

    // 技能栈
    await tester.tap(find.text('技能栈').last);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('不只是会用什么，更在意用得多好。'), findsOneWidget);

    await tester.pump(const Duration(seconds: 1));
  });
}
