#version 460 core
#include <flutter/runtime_effect.glsl>

// ── 果冻受光体 Fragment Shader ─────────────────────────────────────────────
// 手法：
//  1) 偏置光源点：uLight.xy 决定光源中心（左上受光），漫反射随表面法线变化
//  2) 内阴影近似：凸透镜高度场 z 在边缘趋 0，按 ring 混入深色形成边缘内收
//  3) 镜面高光：Blinn-Phong 高光斑（uLight.z 强度）
//  4) 菲涅尔边缘光：按 1-N.z 在侧边泛冷白光（uLight.w 强度），强化果冻通透
// 形状：以矩形中心为原点的凸透镜高度场（凸面朝观察者），可被外部 ClipRRect
//       裁剪为圆角；四角自然趋暗，无需在 shader 内重复圆角 SDF。
// ───────────────────────────────────────────────────────────────────────────

// uniform 全部按 vec4 声明以保证 std140 对齐，Dart 侧按 0/4/8/12 下标 setVec4。
uniform vec4 uSize;    // x = 宽(px), y = 高(px), z = 圆角半径(px, 预留), w = 时间(预留)
uniform vec4 uColA;    // rgb = 顶部受光主亮色
uniform vec4 uColB;    // rgb = 主体色（渐变中间）
uniform vec4 uColC;    // rgb = 暗部/收口色
uniform vec4 uLight;   // xy = 光源中心(uv 0..1), z = 光强(0.5~1.5), w = 菲涅尔强度

layout(location = 0) out vec4 fragColor;

void main() {
  vec2 size = uSize.xy;
  vec2 px = FlutterFragCoord().xy;
  vec2 uv = px / size;
  vec2 halfSize = size * 0.5;

  // 凸透镜高度场：中心 z=1，向边缘递减；超过内切圆部分视为侧壁（z→0）
  vec2 c = (px - halfSize) / halfSize; // -1..1
  float rr2 = dot(c, c);
  float z = sqrt(max(1.0 - rr2, 0.0));
  z = clamp(z, 0.0, 1.0);

  // 凸面法线：N.z 中心最大（面朝观察者），边缘渐平躺
  vec3 N = normalize(vec3(-c / max(z, 0.004), 1.0));

  // 偏置光源：光源在左上略前上方
  vec2 lightPos = vec2(uLight.x, uLight.y) * size;
  vec3 L = normalize(vec3(lightPos - px, size.y * 0.85 * uLight.z));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float ndl = clamp(dot(N, L), 0.0, 1.0);
  float ndh = clamp(dot(N, H), 0.0, 1.0);

  // 基础体积渐变：中心趋亮顶色，边缘向深色收口
  float t = clamp(0.30 + 0.70 * z, 0.0, 1.0);
  vec3 base = mix(uColC.rgb, mix(uColB.rgb, uColA.rgb, t), t);

  // 漫反射受光：面向光源区域提亮并混入受光主色，背光压暗
  vec3 lit = base * (0.42 + 0.78 * ndl);
  lit = mix(lit, mix(uColC.rgb, uColA.rgb, ndl), ndl * 0.34);

  // 内阴影近似：近边缘一圈暗弧，形成「果冻厚度 / 边缘内收」
  float ring = pow(1.0 - z, 1.7);
  lit = mix(lit, uColC.rgb * 0.70, ring * 0.55);

  // 底部暗弧收口（沿用原多层装饰的视觉，纳入 shader 光照一致）
  float bottom = smoothstep(0.42, 1.0, uv.y);
  lit = mix(lit, uColC.rgb * 0.48, bottom * 0.30);

  // 顶部薄受光层：让光源方向上侧整体更通透
  float topBand = smoothstep(0.0, 0.72, 1.0 - uv.y);
  lit = mix(lit, mix(uColA.rgb, vec3(1.0), 0.30), topBand * 0.16 * z);

  // 镜面高光（偏置光源附近的亮斑 = 果冻反光）
  float spec = pow(max(ndh, 0.0), 48.0);
  lit += vec3(1.0) * spec * 0.46 * uLight.z;

  // 菲涅尔边缘光：侧壁泛冷白，强化半透明果冻的边缘光感
  float fres = pow(clamp(1.0 - N.z, 0.0, 1.0), 2.4) * uLight.w;
  lit += vec3(0.82, 0.92, 1.0) * fres * 0.5;

  fragColor = vec4(lit, 1.0);
}
