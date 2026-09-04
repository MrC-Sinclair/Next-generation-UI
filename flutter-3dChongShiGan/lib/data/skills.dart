/// 技能栈（示例占位内容）。level 为 0~1 的熟练度。
class SkillCategory {
  final String name;
  final int gradientIndex;
  final List<Skill> skills;
  const SkillCategory(
      {required this.name, required this.gradientIndex, required this.skills});
}

class Skill {
  final String name;
  final double level;
  const Skill({required this.name, required this.level});
}

const List<SkillCategory> skillCategories = [
  SkillCategory(
    name: '前端 & 跨端',
    gradientIndex: 0,
    skills: [
      Skill(name: 'Flutter', level: 0.95),
      Skill(name: 'Dart', level: 0.92),
      Skill(name: 'TypeScript', level: 0.88),
      Skill(name: 'React', level: 0.85),
    ],
  ),
  SkillCategory(
    name: '后端 & 工程',
    gradientIndex: 1,
    skills: [
      Skill(name: 'Node.js', level: 0.86),
      Skill(name: 'Go', level: 0.78),
      Skill(name: 'PostgreSQL', level: 0.82),
      Skill(name: 'Docker', level: 0.8),
    ],
  ),
  SkillCategory(
    name: '设计 & 动效',
    gradientIndex: 2,
    skills: [
      Skill(name: 'Figma', level: 0.9),
      Skill(name: '动效设计', level: 0.88),
      Skill(name: '3D / Blender', level: 0.7),
      Skill(name: '品牌视觉', level: 0.82),
    ],
  ),
  SkillCategory(
    name: '工具 & 方法',
    gradientIndex: 3,
    skills: [
      Skill(name: 'Git', level: 0.9),
      Skill(name: 'CI / CD', level: 0.78),
      Skill(name: '性能优化', level: 0.84),
      Skill(name: '用户研究', level: 0.75),
    ],
  ),
];
