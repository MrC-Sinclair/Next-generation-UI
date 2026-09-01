import path from 'node:path'
import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import devConfig from './dev'
import prodConfig from './prod'

/**
 * Sass @use 迁移配套：
 * 以函数形式注入 `@use '<relative>/units' as * with ($H5: x)`，
 * 替代原先直接注入变量 `$H5: x;`（变量注入与 @use as * 的模块变量同名冲突）。
 * 相对路径按当前 SCSS 文件动态计算，保证任意目录下的入口文件都能正确加载。
 */
const sassH5Use = (h5: boolean) => (content: string, loaderContext: { resourcePath: string }) => {
  let unitsUrl = path
    .relative(path.dirname(loaderContext.resourcePath), path.join(process.cwd(), 'src', 'styles', 'units'))
    .replace(/\\/g, '/')
  if (!unitsUrl.startsWith('.')) unitsUrl = './' + unitsUrl
  return `@use '${unitsUrl}' as * with ($H5: ${h5});\n${content}`
}

/**
 * 多端构建配置
 *
 * 单位策略：
 *  - 小程序 / 鸿蒙 / RN：designWidth = 750，pxtransform 开启，SCSS 里写「设计稿 px」→ 自动转 rpx
 *  - H5：pxtransform 关闭，改由 styles/_units.scss 中的 px() / fs() 输出 clamp() 流体值，
 *        这样 PC 宽屏、平板、手机都能得到合理尺寸（Taro 默认 rem 方案在 1920px 下会放大 2.5 倍，不可用）
 */
export default defineConfig(async (merge, { mode }) => {
  const baseConfig: UserConfigExport = {
    projectName: 'aurora-glass-site',
    date: '2026-8-30',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV}`,
    plugins: [
      '@tarojs/plugin-platform-h5',
      '@tarojs/plugin-platform-weapp',
      '@tarojs/plugin-platform-harmony-ets'
    ],
    defineConstants: {},
    copy: { patterns: [], options: {} },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: { enable: false }
    },
    cache: { enable: false },
    logger: { quiet: false, stats: true },

    /* ---------------- 小程序端 ---------------- */
    mini: {
      postcss: {
        pxtransform: { enable: true, config: {} },
        url: { enable: true, config: { limit: 10240 } },
        cssModules: { enable: false }
      },
      sassLoaderOption: {
        additionalData: sassH5Use(false)
      }
    },

    /* ---------------- H5 端（PC / 手机浏览器 / PWA） ---------------- */
    h5: {
      publicPath: mode === 'development' ? '/' : './',
      staticDirectory: 'static',
      router: { mode: 'hash' },
      esnextModules: ['@tarojs/components'],
      postcss: {
        // 关闭 px 转换，改用 clamp() 流体单位，保证 PC 大屏不会被等比放大
        pxtransform: { enable: false },
        autoprefixer: { enable: true, config: {} },
        cssModules: { enable: false }
      },
      sassLoaderOption: {
        additionalData: sassH5Use(true)
      },
      devServer: {
        port: 10086,
        host: '0.0.0.0',
        open: false,
        https: false
      }
    },

    /* ---------------- 鸿蒙 ArkTS 端 ---------------- */
    harmony: {
      projectPath: 'harmony',
      sassLoaderOption: {
        additionalData: sassH5Use(false)
      }
    }
  }

  if (mode === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
