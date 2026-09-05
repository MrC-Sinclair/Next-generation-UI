/**
 * 首页概览：液态 Hero + 现在 + 数字 + 模块预告。
 * 所有卡片均可按压产生跟随指尖的镜面高光。
 */
import { GlassCard } from '../common/GlassCard';
import { GlassNav } from '../common/GlassNav';
import { GlassAvatar } from '../common/Avatar';
import { LiquidBackground } from '../common/LiquidBackground';
import { PROFILE, NowItem, StatItem, DrawerItem } from '../model/Profile';
import { T } from '../common/Theme';

@Entry
@Component
struct Index {
  @State scrollY: number = 0;

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      LiquidBackground({ parallax: this.scrollY })

      Scroll() {
        Column({ space: 14 }) {
          // ---------------- Hero ----------------
          GlassCard({ radius: 30, pad: 26 }) {
            Column({ space: 10 }) {
              GlassAvatar({ size: 92, initial: '澈' })
              Text(PROFILE.name)
                .fontSize(30)
                .fontWeight(700)
                .fontColor(T.TXT)
              Text(`${PROFILE.nameEn} · ${PROFILE.role}`)
                .fontSize(14)
                .fontColor(T.TXT2)
              Text(PROFILE.tagline)
                .fontSize(12)
                .fontColor(T.ACCENT)
                .letterSpacing(2)

              Column()
                .width('100%')
                .height(1)
                .backgroundColor(T.LINE)
                .margin({ top: 6, bottom: 4 })

              Column({ space: 5 }) {
                ForEach(PROFILE.bio, (line: string) => {
                  Text(line)
                    .fontSize(15)
                    .fontColor(T.TXT2)
                    .lineHeight(26)
                }, (line: string) => line)
              }
              .alignItems(HorizontalAlign.Center)

              // 现在
              Row({ space: 8 }) {
                ForEach(PROFILE.now, (n: NowItem) => {
                  Column({ space: 2 }) {
                    Text(n.label)
                      .fontSize(11)
                      .fontColor(T.ACCENT)
                    Text(n.value)
                      .fontSize(13)
                      .fontColor(T.TXT)
                      .fontWeight(600)
                  }
                  .layoutWeight(1)
                  .padding({ top: 8, bottom: 8 })
                  .backgroundColor('rgba(255,255,255,0.07)')
                  .borderRadius(14)
                  .border({ width: 1, color: 'rgba(255,255,255,0.12)' })
                }, (n: NowItem) => n.label)
              }
              .width('100%')
              .margin({ top: 6 })
            }
            .width('100%')
            .alignItems(HorizontalAlign.Center)
          }

          // ---------------- 数字 ----------------
          Row({ space: 12 }) {
            ForEach(PROFILE.stats.slice(0, 2), (s: StatItem) => {
              StatCard({ num: s.num, unit: s.unit, label: s.label })
            }, (s: StatItem) => s.label)
          }
          .width('100%')

          Row({ space: 12 }) {
            ForEach(PROFILE.stats.slice(2, 4), (s: StatItem) => {
              StatCard({ num: s.num, unit: s.unit, label: s.label })
            }, (s: StatItem) => s.label)
          }
          .width('100%')

          // ---------------- 模块预告 ----------------
          Text('小站里的抽屉')
            .fontSize(13)
            .fontColor(T.TXT3)
            .letterSpacing(3)
            .margin({ top: 8 })

          ForEach(PROFILE.drawers, (d: DrawerItem, idx: number) => {
            GlassCard({ radius: 24, pad: 18 }) {
              Row({ space: 14 }) {
                Text(d.icon)
                  .fontSize(26)
                Column({ space: 4 }) {
                  Text(d.title)
                    .fontSize(17)
                    .fontWeight(700)
                    .fontColor(T.TXT)
                  Text(d.desc)
                    .fontSize(13)
                    .fontColor(T.TXT2)
                }
                .layoutWeight(1)
                .alignItems(HorizontalAlign.Start)

                Text('敬请期待')
                  .fontSize(11)
                  .fontColor(T.TXT3)
                  .backgroundColor('rgba(255,255,255,0.08)')
                  .borderRadius(10)
                  .padding({ left: 9, right: 9, top: 4, bottom: 4 })
              }
              .width('100%')
            }
          }, (d: DrawerItem, idx: number) => d.title)

          Text(PROFILE.footer)
            .fontSize(11)
            .fontColor(T.TXT3)
            .margin({ top: 10, bottom: 4 })
        }
        .width('100%')
        .padding({ left: 18, right: 18, top: 28, bottom: 130 })
      }
      .scrollBar(BarState.Off)
      .edgeEffect(EdgeEffect.Spring)
      .width('100%')
      .height('100%')
      .onDidScroll((delta: number, st: ScrollState) => {
        this.scrollY += delta;
      })

      GlassNav({ active: 'home' })
    }
    .width('100%')
    .height('100%')
  }
}

/**
 * 数字卡片（首页内私有子组件）
 */
@Component
struct StatCard {
  @Prop num: string = '';
  @Prop unit: string = '';
  @Prop label: string = '';

  build() {
    GlassCard({ radius: 22, pad: 16, blur: 24 }) {
      Column({ space: 4 }) {
        Row() {
          Text(this.num)
            .fontSize(26)
            .fontWeight(800)
            .fontColor('#5EE3FF')
          Text(this.unit)
            .fontSize(14)
            .fontColor(T.TXT2)
            .margin({ left: 3 })
        }
        .alignItems(VerticalAlign.Bottom)

        Text(this.label)
          .fontSize(12)
          .fontColor(T.TXT3)
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    .layoutWeight(1)
  }
}
