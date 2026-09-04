/**
 * 手绘几何：用确定性伪随机生成"抖动"的 SVG 路径。
 * 所有路径由 seed 驱动，同一 seed 渲染结果稳定，不会闪烁。
 */

export type Pt = [number, number];

/** 确定性伪随机（mulberry32） */
export function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

/** 两点之间抖动折线（沿法向偏移） */
function jitterLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rand: () => number,
  rough: number,
  seg = 26
): Pt[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const n = Math.max(3, Math.round(len / seg));
  const nx = -dy / len;
  const ny = dx / len;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // 端点抖动减半，中段全量 → 更像手腕运笔
    const edge = Math.min(t, 1 - t) * 2;
    const j = (rand() * 2 - 1) * rough * (0.35 + edge * 0.65);
    pts.push([x1 + dx * t + nx * j, y1 + dy * t + ny * j]);
  }
  return pts;
}

function ptsToPath(pts: Pt[], start: boolean): string {
  let d = '';
  pts.forEach((p, i) => {
    d += i === 0 && start ? `M ${f(p[0])} ${f(p[1])} ` : `L ${f(p[0])} ${f(p[1])} `;
  });
  return d;
}

/**
 * 手绘矩形路径（四角略圆、笔画过冲）
 * @param corner 角点内收，模拟手绘圆角
 */
export function sketchRectPath(
  w: number,
  h: number,
  seed: number,
  rough = 1.6,
  corner = 5,
  overshoot = 4
): string {
  const rand = mulberry32(seed);
  const c = corner;
  const corners: Pt[] = [
    [c, c],
    [w - c, c],
    [w - c, h - c],
    [c, h - c],
  ];
  // 起笔从左下角往上略过冲开始（像真人描边起笔）
  let d = `M ${f(corners[3][0] - overshoot)} ${f(corners[3][1] + overshoot * 0.6)} `;
  d += `L ${f(corners[0][0])} ${f(corners[0][1])} `;
  for (let k = 0; k < 4; k++) {
    const a = corners[k];
    const b = corners[(k + 1) % 4];
    const line = jitterLine(a[0], a[1], b[0], b[1], rand, rough);
    d += ptsToPath(line, false);
    // 过冲：每笔终点越出角点一点点
    const odx = (b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1] || 1);
    const ody = (b[1] - a[1]) / Math.max(1e-6, Math.hypot(b[0] - a[0], b[1] - a[1]));
    d += `L ${f(b[0] + odx * overshoot * rand())} ${f(b[1] + ody * overshoot * rand())} `;
  }
  d += 'Z';
  return d;
}

/** 手绘波浪下划线（红笔勾重点） */
export function sketchUnderlinePath(w: number, seed: number, amp = 2.6, period = 34): string {
  const rand = mulberry32(seed);
  const mid = amp + 2;
  const n = Math.max(8, Math.round(w / 9));
  let d = '';
  for (let i = 0; i <= n; i++) {
    const x = (w * i) / n;
    const wave = Math.sin((x / period) * Math.PI * 2) * amp;
    const j = (rand() * 2 - 1) * 0.8;
    const y = mid + wave + j;
    d += i === 0 ? `M ${f(x)} ${f(y)} ` : `L ${f(x)} ${f(y)} `;
  }
  return d;
}

/** 手绘圈（描重点的椭圆圈，可两圈重叠） */
export function sketchEllipsePath(
  rx: number,
  ry: number,
  seed: number,
  rough = 1.8,
  loops = 2
): string {
  let d = '';
  for (let l = 0; l < loops; l++) {
    const rand = mulberry32(seed + l * 17);
    const start = rand() * Math.PI * 2;
    const steps = 26;
    const a0 = 0.985 + rand() * 0.05; // 每圈略大一点，重叠感
    for (let i = 0; i <= steps; i++) {
      const t = start + (i / steps) * Math.PI * 2.05;
      const jj = (rand() * 2 - 1) * rough * 0.7;
      const x = Math.cos(t) * (rx * a0) + jj;
      const y = Math.sin(t) * (ry * a0) + jj;
      d += i === 0 && l === 0 ? `M ${f(x + rx)} ${f(y + ry)} ` : '';
      d += `L ${f(x + rx)} ${f(y + ry)} `;
    }
  }
  return d;
}

/** 一笔画五角星（涂鸦） */
export function sketchStarPath(r: number, seed: number, rough = 1.1): string {
  const rand = mulberry32(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    const jx = (rand() * 2 - 1) * rough;
    const jy = (rand() * 2 - 1) * rough;
    pts.push([Math.cos(a) * r + jx, Math.sin(a) * r + jy]);
  }
  let d = `M ${f(pts[4][0])} ${f(pts[4][1])} `;
  for (const p of pts) d += `L ${f(p[0])} ${f(p[1])} `;
  return d;
}

/** 手绘箭头（曲线箭身 + 两笔箭头尖） */
export function sketchArrowPath(
  w: number,
  h: number,
  seed: number,
  rough = 1.4
): { body: string; head: string } {
  const rand = mulberry32(seed);
  const n = 10;
  let body = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = w * t;
    const y = h * t * t * 0.72 + Math.sin(t * 6) * 3 + (rand() * 2 - 1) * rough * 0.8;
    body += i === 0 ? `M ${f(x)} ${f(y)} ` : `L ${f(x)} ${f(y)} `;
  }
  const ex = w;
  const ey = h * 0.72 + Math.sin(6) * 3;
  const head = `M ${f(ex - 16)} ${f(ey - 9)} L ${f(ex + 2)} ${f(ey + 1)} L ${f(ex - 13)} ${f(ey + 11)} `;
  return { body, head };
}

/** 涂鸦乱线（涂黑/强调） */
export function sketchScribblePath(w: number, h: number, seed: number, lines = 5): string {
  const rand = mulberry32(seed);
  let d = '';
  for (let i = 0; i < lines; i++) {
    const y = (h / lines) * (i + 0.5);
    const y1 = y + (rand() * 2 - 1) * h * 0.3;
    const y2 = y + (rand() * 2 - 1) * h * 0.3;
    d += `M ${f(rand() * 6)} ${f(y1)} L ${f(w - rand() * 6)} ${f(y2)} `;
  }
  return d;
}
