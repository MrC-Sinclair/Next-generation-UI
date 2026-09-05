---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_2c3985b5a89011f1a393525400f8a581
    ReservedCode1: JWvxdKQ3d186B7llgEaao/19iuR9MaxfphECdNHqJCQy59SKN22o0/8RjbMwgpNuMGRRMn2ZnYmixxi02b7hLZ7zahHpzppRNo4Q9INXScUQIjyVWNP6mMV84IWZVJmhShGTpTCmDnkcpOhDog18cn1+34O4D/FdWEKkoDow37InDVcNMz1pgcebxpE=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_2c3985b5a89011f1a393525400f8a581
    ReservedCode2: JWvxdKQ3d186B7llgEaao/19iuR9MaxfphECdNHqJCQy59SKN22o0/8RjbMwgpNuMGRRMn2ZnYmixxi02b7hLZ7zahHpzppRNo4Q9INXScUQIjyVWNP6mMV84IWZVJmhShGTpTCmDnkcpOhDog18cn1+34O4D/FdWEKkoDow37InDVcNMz1pgcebxpE=
---

# 交付 / 拷贝 / 运行环境（给接手机器与陌生开发者）

> 场景：把整个项目目录复制到另一台机器，交给一个从没见过这个仓库的 AI 或开发者，要求**仅凭仓库内文档**成功读懂并运行。
> 配套文档：[架构导览 ARCHITECTURE.md](./ARCHITECTURE.md)。

## 1. 拷贝什么、排除什么（交付前清单）

### 必须随源码保留

| 内容 | 原因 |
| --- | --- |
| `package-lock.json` | **锁文件，必须保留**。缺失会导致 `npm install` 按 `~` 范围解析出新版本依赖，可能引入破坏性变更（版本漂移）。重装依赖一律用 `npm ci`（严格按锁文件）。 |
| `assets/`、`src/`、`scripts/`、`app.json`、`package.json`、`tsconfig.json`、`README.md`、`docs/` | 源码与文档本体 |
| `LICENSE` | 许可 |

### 可以 / 应该排除（可再生或属生成物）

| 内容 | 说明 |
| --- | --- |
| `node_modules/` | 平台相关 + 体积巨大；拷贝后目标机重新 `npm ci` 即可。直接整包复制极易因平台差异（Windows/macOS 二进制、符号链接）坏掉 |
| `.expo/` | Expo 开发缓存与类型生成物（`.expo/types/`、`devices.json` 等），**不属于源码**；首次启动自动重建 |
| `expo-env.d.ts` | Expo 自动生成的类型声明（根目录）；缺失时先 `npx expo start` 一次会自动重建。若被一并拷贝也无害 |
| `dist/` | web 静态导出产物（含 2MB+ 的 `dist/preview.html`），可再生（见 §4）；**注意 `.gitignore` 已忽略 `dist/`**，git 交付时本就不会带上 |
| `scripts/.preview-charset.txt` | `build-single-file.py` 运行时生成的临时字符集文件，非源码 |
| `.vscode/`、`.claude/` | 编辑器/工具个人配置，可带可不带 |

> 目录里若有 `scripts/charset.txt`：它是早期人工留档的字符集副本，构建脚本并不读取（脚本自管 `.preview-charset.txt`），可忽略或删除，不影响构建。

### 拷贝后验证（三步）

```bash
# 1) 按锁文件安装（比 install 更可复现）
npm ci

# 2) 健康检查（可选但推荐）
npx expo-doctor

# 3) 跑通 web（最快验证信号）
npm run web
# 浏览器打开终端提示的 localhost 地址，出现"米黄纸底 + 手绘描边 + 中文手写排版"即成功
```

## 2. 环境要求

| 项 | 要求 | 说明 |
| --- | --- | --- |
| Node.js | **^20.19.4 || ^22.13.0 || ^24.3.0 || ≥25** | 由 `react-native@0.86` 的 `engines` 字段实际约束（仓库 `package.json` 未声明 engines，以 node_modules 内声明为准）；建议用 Node 22 LTS |
| 包管理器 | **npm**（必须） | 项目带 `package-lock.json`，用 `npm ci` / `npm install`；不要混用 yarn/pnpm |
| Python 3 | 仅"单文件预览构建链路"需要（§4） | 用于 `scripts/*.py` |
| 平台支持 | **web 全平台可跑；iOS 仅 macOS** | Windows/Linux 只能跑 web 与 Android |
| Expo Go | Android/iOS 真机调试需要 | 手机装 Expo Go，扫码启动 `npx expo start` 的二维码；本项目无原生自定义代码，Expo Go 可覆盖 |
| Android | Android Studio 模拟器或真机 + USB 调试 | `npm run android` 会尝试拉起设备；首次可能需安装 Android SDK（Expo 会引导） |
| iOS | macOS + Xcode + 模拟器（或 iPhone + Expo Go） | **Windows 上无法构建/运行 iOS**——Expo 工具链本身不依赖平台，但 Apple 的编译链只在 macOS |

浏览器建议 Chrome / Edge 最新版；`expo start` 偶发网络代理问题时可设 `EXPO_NO_TELEMETRY=1` 或换局域网模式，见 §5 FAQ。

## 3. 最简启动路径（新机器第一件事）

```bash
npm ci          # 或 npm install（首次没有 node_modules 时）
npm run web     # 推荐最先验证：无需模拟器/手机
```

- 想立刻看效果选 web；只有一台手机时用 Expo Go 扫码跑 `npx expo start`。
- Android/iOS 原生调试命令见 README「常用命令」。

## 4. 特殊构建链路：web 静态单文件预览（dist/preview.html）

`dist/preview.html` 是把 expo 静态导出产物打包成**单个自包含 HTML**（字体子集化 base64 内联、CSS/JS 全内联、零外部请求），可双击本地打开或在任意沙箱 iframe 预览。

### 依赖

- Python 3 + [fonttools](https://pypi.org/project/fonttools/)（提供 `pyftsubset` 命令）：`pip install fonttools`
- Node 环境（同主项目）

### 再生成步骤（按序执行，缺一不可）

```bash
# 1) expo 静态导出到 dist/（web.output 已配 "static"，产出多页 HTML）
npx expo export --platform web

# 2) 把产物中的根绝对路径改写成相对路径（预览沙箱/子路径可打开）
python3 scripts/make-paths-relative.py dist

# 3) 打包单文件（子集化字体 + 内联 CSS/JS）
python3 scripts/build-single-file.py
# 输出 dist/preview.html（约 2MB）
```

> 注意：每次重新 `expo export` 后**必须**先跑第 2 步再跑第 3 步（build 脚本读取的是相对路径产物，且 docstring 明确"在跑完 export + make-paths-relative 之后"）。
> 第 3 步运行时会向 `scripts/` 写入临时字符集文件 `.preview-charset.txt` 并在结束前自行清理；它不会读取 `scripts/charset.txt`。

## 5. 常见问题（FAQ）

**Q1：`npx tsc --noEmit` 报错，提示找不到 `expo-env.d.ts` 或 `.expo/types/`？**
这是 Expo 类型生成物缺失（从 git 交付/排除生成物拷贝时会遇到）。先跑一次 `npx expo start`（或 `npx expo customize tsconfig.json`），Expo 会自动重建 `expo-env.d.ts` 与 `.expo/types/`，再跑 tsc 即可。

**Q2：跑了 `npm run reset-project` 会怎样？**
`scripts/reset-project.js` 是 create-expo-app 模板残留脚本，**不要运行**。它会删除/移走 `src/` 与 `scripts/` 并重建空白模板页，把本项目清空。详见 README「常用命令」的警告。

**Q3：Windows 上能不能跑 iOS？**
不能。iOS 需要 macOS + Xcode。Windows 上请用 `npm run web` 或 `npm run android`；如需预览 iOS 效果可用 web 静态导出（§4）在浏览器查看（本项目的跨端差异已在 README 表格列出，web 是最接近的效果源）。

**Q4：`npm run web` 后浏览器白屏 / 页面无样式？**
1) 确认没有把 `dist/` 或 `.expo/` 的旧产物混进源码目录（先删除再重试）；2) 确认端口未被占用（Expo 会自动换端口，看终端实际 URL）；3) 清浏览器缓存或开无痕窗口；4) 仍失败跑 `npx expo-doctor` 看依赖是否与 SDK 57 对齐。

**Q5：装了新依赖后页面报错 / 版本冲突？**
本项目依赖全部用 Expo SDK 57 的兼容版本（package.json 中 `~` 范围）。加依赖请用 `npx expo install <pkg>`（自动选兼容版本），不要裸 `npm install <pkg>`。

**Q6：改了 `src/global.css` 没效果？**
确认页面有 `import '@/global.css'`（根布局 `_layout.tsx` 已 import）；并注意 global.css 只在 **web** 生效，原生端等价效果需按 ARCHITECTURE §8 单独实现。
*（内容由AI生成，仅供参考）*
