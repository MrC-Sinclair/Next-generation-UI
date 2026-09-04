import 'package:flutter/material.dart';
import 'package:flutter_3d_site/data/profile.dart';
import 'package:flutter_3d_site/theme/app_theme.dart';
import 'package:flutter_3d_site/widgets/content_frame.dart';
import 'package:flutter_3d_site/widgets/jelly.dart';
import 'package:flutter_3d_site/widgets/reveal.dart';
import 'package:flutter_3d_site/widgets/responsive.dart';
import 'package:flutter_3d_site/widgets/section_title.dart';

class ContactPage extends StatefulWidget {
  const ContactPage({super.key});

  @override
  State<ContactPage> createState() => _ContactPageState();
}

class _ContactPageState extends State<ContactPage> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _msg = TextEditingController();

  void _submit() {
    if (_name.text.isEmpty || _msg.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('请至少填写称呼与留言内容'),
          backgroundColor: Colors.pinkAccent.withValues(alpha: 0.9),
        ),
      );
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('已收到，${_name.text}！我会尽快回复你 ✨'),
        backgroundColor: Colors.deepPurpleAccent.withValues(alpha: 0.9),
      ),
    );
    _name.clear();
    _email.clear();
    _msg.clear();
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _msg.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final desktop = Responsive.isDesktop(context);
    final g1 = AppGradients.blueCyan;
    final g2 = AppGradients.warm;
    return ContentFrame(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionTitle(kicker: 'Contact', title: '联系方式'),
          const SizedBox(height: 10),
          const Text('有合作、想法或只是想聊聊？随时找我。',
              style: TextStyle(color: Color(0xFFB6BCE0), fontSize: 15)),
          const SizedBox(height: 28),
          desktop ? _desktopLayout(g1, g2) : _mobileLayout(g1, g2),
        ],
      ),
    );
  }

  Widget _desktopLayout(Gradient g1, Gradient g2) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 2, child: _infoCard(g1)),
        const SizedBox(width: 24),
        Expanded(flex: 3, child: _formCard(g2)),
      ],
    );
  }

  Widget _mobileLayout(Gradient g1, Gradient g2) {
    return Column(
      children: [
        _infoCard(g1),
        const SizedBox(height: 24),
        _formCard(g2),
      ],
    );
  }

  Widget _infoCard(Gradient grad) {
    return RevealOnLoad(
      child: Container(
        decoration: AppTheme.jelly(
          gradient: grad,
          radius: BorderRadius.circular(28),
          elevation: 28,
        ),
        padding: const EdgeInsets.all(32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('直接联系',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            const Text('邮箱是最快的方式，通常 24 小时内回复。',
                style: TextStyle(color: Colors.white70, fontSize: 14)),
            const SizedBox(height: 28),
            _infoRow(Icons.mail_rounded, '邮箱', Profile.email),
            const SizedBox(height: 14),
            _infoRow(Icons.place_rounded, '所在地', Profile.location),
            const SizedBox(height: 26),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: Profile.socials
                  .map((s) => Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                              color: Colors.white.withValues(alpha: 0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(s.icon, color: Colors.white, size: 18),
                            const SizedBox(width: 8),
                            Text(s.name,
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label,
                style: const TextStyle(color: Colors.white70, fontSize: 12)),
            Text(value,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 15)),
          ],
        ),
      ],
    );
  }

  Widget _formCard(Gradient grad) {
    return RevealOnLoad(
      delay: const Duration(milliseconds: 120),
      child: GlassCard(
        radius: 28,
        padding: const EdgeInsets.all(32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('给我留言',
                style: TextStyle(
                    color: AppColors.textLight,
                    fontSize: 20,
                    fontWeight: FontWeight.w800)),
            const SizedBox(height: 22),
            _field('称呼', _name, false),
            const SizedBox(height: 16),
            _field('邮箱（选填）', _email, false),
            const SizedBox(height: 16),
            _field('想说的话', _msg, true),
            const SizedBox(height: 26),
            JellyButton(
              label: '发送留言',
              icon: Icons.send_rounded,
              gradient: grad,
              onTap: _submit,
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(String label, TextEditingController c, bool multiline) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
        const SizedBox(height: 8),
        Container(
          decoration: AppTheme.glass(radius: BorderRadius.circular(16), alpha: 0.08),
          child: TextField(
            controller: c,
            maxLines: multiline ? 4 : 1,
            style: const TextStyle(color: AppColors.textLight, fontSize: 15),
            decoration: const InputDecoration(
              border: InputBorder.none,
              contentPadding:
                  EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
      ],
    );
  }
}
