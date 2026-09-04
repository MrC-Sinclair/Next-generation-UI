import 'package:flutter/material.dart';

/// 个人资料（示例占位内容，全部集中在此，替换成真实信息即可）
class Profile {
  static const name = '苏沐';
  static const enName = 'Su Mu';
  static const role = '全栈创意开发者 · 独立设计师';
  static const tagline =
      '我用代码与设计为产品注入「触感」。专注交互动效、3D 视觉与跨端体验。';
  static const location = '中国 · 杭州';
  static const email = 'hello@sumu.dev';
  static const initials = '苏';

  static const bio = [
    '你好，我是苏沐，一名热爱「质感」的全栈创意开发者。过去 6 年里，我在初创团队与独立项目中打磨产品，从一行代码到一个完整的跨端应用。',
    '我相信好的界面应当像一块有温度的果冻——柔软、可按压、有反馈。无论是 Web、移动端还是小程序，我都希望用户能「摸」到界面的情绪。',
    '工作之外，我喜欢研究动效曲线、收集材质灵感，也偶尔写写关于设计与工程的博客。',
  ];

  static const stats = [
    Stat(label: '从业年限', value: '6', suffix: '年'),
    Stat(label: '上线项目', value: '40', suffix: '+'),
    Stat(label: '服务客户', value: '28', suffix: ''),
    Stat(label: '开源 Stars', value: '3.2', suffix: 'k'),
  ];

  static const socials = [
    Social(name: 'GitHub', handle: '@sumu', icon: Icons.code_rounded),
    Social(name: '微博', handle: '@苏沐Design', icon: Icons.public_rounded),
    Social(name: '邮箱', handle: 'hello@sumu.dev', icon: Icons.mail_rounded),
    Social(name: '微信', handle: 'sumu_dev', icon: Icons.chat_bubble_rounded),
  ];

  static const timeline = [
    TimelineItem(
      year: '2024',
      title: '独立开发者',
      desc: '成立个人工作室，专注跨端产品与动效设计系统。',
    ),
    TimelineItem(
      year: '2021',
      title: '高级前端工程师',
      desc: '负责核心 C 端产品的体验架构与组件库建设。',
    ),
    TimelineItem(
      year: '2019',
      title: '全栈工程师',
      desc: '从 0 到 1 参与多个创业项目，覆盖前后端与部署。',
    ),
    TimelineItem(
      year: '2018',
      title: '设计 → 工程',
      desc: '从视觉设计转向工程实现，开始两者的融合之路。',
    ),
  ];

  static const values = ['动效', '质感', '克制', '跨端', '开源', '用户同理心'];
}

class Stat {
  final String label;
  final String value;
  final String suffix;
  const Stat({required this.label, required this.value, required this.suffix});
}

class Social {
  final String name;
  final String handle;
  final IconData icon;
  const Social(
      {required this.name, required this.handle, required this.icon});
}

class TimelineItem {
  final String year;
  final String title;
  final String desc;
  const TimelineItem(
      {required this.year, required this.title, required this.desc});
}
