#version 460 core
#include <flutter/runtime_effect.glsl>

// ── 果冻受光体 Fragment Shader ─────────────────────────────────────────────
// 手法：
//  1) 高度场 = 圆角矩形 SDF 边缘带内的四分之一椭圆收口 × 全局缓凸面：
//     大面积顶面保持受光，仅在靠近边界一段距离内平滑下潜到侧壁，
//     且形态严格贴合圆角矩形（宽矩形不再内切为椭圆光斑）。
//  2) 法线由高度场数值梯度得到；再叠加缓凸面法线参与受光方向计算。
//  3) 偏置光源点：uLight.xy 决定光源中心，漫反射随光源位置变化。
//  4) 内阴影近似：边缘带按 z 混入深色形成「果冻厚度」。
//  5) 镜面高光：Blinn-Phong（uLight.z 强度）；菲涅尔边缘光（uLight.w）。
// ───────────────────────────────────────────────────────────────────────────

// uniform 全部按 vec4 声明以保证 std140 对齐，Dart 侧按 0/4/8/12 下标 setFloat。
uniform vec4 uSize;    // x = 宽(px), y = 高(px), z = 圆角半径(px), w = 预留
uniform vec4 uColA;    // rgb = 顶部受光主亮色
uniform vec4 uColB;    // rgb = 主体色（渐变中间）
uniform vec4 uColC;    // rgb = 暗部/收口色
uniform vec4 uLight;   // xy = 光源中心(uv 0..1), z = 光强(0.5~1.5), w = 菲涅尔强度

layout(location = 0) out vec4 fragColor;

// 圆角矩形 SDF：p 相对中心，b = 半尺寸，r = 圆角半径；内部为负。
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - (b - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 size = uSize.xy;
  vec2 px = FlutterFragCoord().xy;
  vec2 uv = px / size;
  vec2 halfSize = size * 0.5;
  float radius = clamp(uSize.z, 0.0, min(halfSize.x, halfSize.y));

  // 边缘收口带宽：短边的一半比例，随尺寸自适应
  float falloff = max(min(halfSize.x, halfSize.y) * 0.55, 2.0);

  // 高度场：e = 到边界的内距，s: 0(边界)→1(内部)
  float e = -sdRoundBox(px - halfSize, halfSize, radius);
  float s = clamp(e / falloff, 0.0, 1.0);
  float ze = sqrt(max(1.0 - (1.0 - s) * (1.0 - s), 0.0)); // 四分之一椭圆收口

  // 全局缓凸面：中心 1.0 → 角部 0.71，让顶面仍有微弱球面趋势
  vec2 c = (px - halfSize) / halfSize; // -1..1
  float zg = sqrt(max(1.0 - 0.25 * dot(c, c), 0.0));
  float z = clamp(zg * ze, 0.0, 1.0);

  // 法线：缓凸面解析梯度（柔和受光面），边缘带由 ze 梯度加强
  vec3 N = normalize(vec3(-c * 0.55 / max(zg, 0.42) * ze, 1.0));

  // 偏置光源：光源在左上略前上方
  vec2 lightPos = vec2(uLight.x, uLight.y) * size;
  vec3 L = normalize(vec3(lightPos - px, size.y * 0.85 * uLight.z));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float ndl = clamp(dot(N, L), 0.0, 1.0);
  float ndh = clamp(dot(N, H), 0.0, 1.0);

  // 基础体积渐变：中心趋亮顶色，边缘向深色收口。
  // 大面积表面额外降低亮度上限（atten），避免整块过曝发白；小图标保持通透。
  float atten = clamp(1.0 - (min(halfSize.x, halfSize.y) - 56.0) / 520.0, 0.76, 1.0);
  float t = clamp((0.26 + 0.62 * z) * atten, 0.0, 1.0);
  vec3 base = mix(uColC.rgb, mix(uColB.rgb, uColA.rgb, t), t);

  // 漫反射受光：面向光源区域提亮并混入受光主色，背光压暗
  vec3 lit = base * (0.44 + 0.66 * ndl);
  lit = mix(lit, mix(uColC.rgb, uColA.rgb, ndl), ndl * 0.30);

  // 内阴影近似：边缘一圈暗弧，形成「果冻厚度 / 边缘内收」
  float ring = pow(1.0 - ze, 1.5);
  lit = mix(lit, uColC.rgb * 0.72, ring * 0.50);

  // 底部暗弧收口（沿用原多层装饰的视觉，纳入 shader 光照一致）
  float bottom = smoothstep(0.46, 1.0, uv.y);
  lit = mix(lit, uColC.rgb * 0.50, bottom * 0.28);

  // 顶部薄受光层：让光源方向上侧整体更通透
  float topBand = smoothstep(0.0, 0.72, 1.0 - uv.y);
  lit = mix(lit, mix(uColA.rgb, vec3(1.0), 0.30), topBand * 0.10 * z);

  // 镜面高光（偏置光源附近的亮斑 = 果冻反光）
  float spec = pow(max(ndh, 0.0), 42.0);
  lit += vec3(1.0) * spec * 0.34 * uLight.z;

  // 菲涅尔边缘光：侧壁泛冷白，强化半透明果冻的边缘光感
  float fres = pow(clamp(1.0 - N.z, 0.0, 1.0), 2.2) * uLight.w;
  lit += vec3(0.82, 0.92, 1.0) * fres * 0.38;

  fragColor = vec4(lit, 1.0);
}
