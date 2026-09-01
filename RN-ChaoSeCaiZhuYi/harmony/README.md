# 鸿蒙（HarmonyOS / OpenHarmony）接入说明

本项目 `src/` 下的代码全部使用 React Native 标准组件（View / Text / ScrollView /
Pressable / TextInput / Animated / StyleSheet），因此可以复用给鸿蒙的
**RN-OH（`@react-native-oh/react-native-harmony`）** 工程。

## 1. 环境

- DevEco Studio 4.1+（API 11+）
- Node 18+
- `npm i -g @react-native-oh/react-native-harmony-cli`

## 2. 建工程并复用 src/

```bash
# 1. 在 harmony/ 下初始化一个 RN-OH 宿主工程
cd harmony
rnh init ChromaOH

# 2. 把本项目的 src/ 软链/拷贝进宿主工程
cp -r ../src ./ChromaOH/src
cp ../app.json ./ChromaOH/

# 3. 入口文件（ChromaOH/App.tsx 或 index.js）改成：
#    import App from './src/App';
#    AppRegistry.registerComponent('ChromaOH', () => App);
```

## 3. 需要留意的差异

本项目已经提前规避了大部分坑，下面几点是剩下的：

| 能力 | 处理 |
| --- | --- |
| 渐变 | 项目里没用第三方渐变库，全部用**纯色块 + 条纹**实现，鸿蒙可直接渲染 |
| 阴影 | `shadowOffset/shadowRadius` 在鸿蒙上部分版本不生效，已用 `elevation` 兜底 |
| 字体 | `FONT.display` 在原生端返回 `undefined`，自动回落系统字体，不会崩 |
| 百分比尺寸 | 栅格用 `width: '33.33%'`，鸿蒙 Yoga 布局支持 |
| 动画 | 只用了 `Animated.timing/loop/sequence` + `useNativeDriver`，鸿蒙支持 |
| 外链 | `utils/links.ts` 已对非 Web 端走 `Linking.openURL` |

## 4. 打包

```bash
cd harmony/ChromaOH
npm run build:harmony     # 具体命令以 RN-OH 版本为准
# 产物用 DevEco Studio 签名后安装到真机
```

## 5. 鸿蒙专属微调（可选）

如果某处需要在鸿蒙上走不同实现，加平台后缀文件即可，Metro 会自动优先命中：

```
src/components/ui/Block.tsx        # 默认实现
src/components/ui/Block.harmony.tsx # 鸿蒙专属实现
```

`metro.config.js` 里已经把 `harmony.tsx / harmony.ts` 放进了 `sourceExts` 首位。
