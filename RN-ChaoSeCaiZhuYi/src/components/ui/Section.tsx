import React from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {BORDER, C, FONT, R, W, hardShadow} from '../../theme/tokens';

export interface SectionHeaderProps {
  /** 序号：01 / 02 … */
  index?: string;
  title: string;
  en?: string;
  color?: string;
  /** 标题字号 */
  size?: number;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** 区块标题：彩色序号块 + 巨型标题 + 英文小标 */
export function SectionHeader({
  index,
  title,
  en,
  color = C.magenta,
  size = 30,
  right,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[{flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap'}, style]}>
      <View style={{flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginRight: 12}}>
        {!!index && (
          <View
            style={[
              {
                backgroundColor: color,
                borderWidth: BORDER.thin,
                borderColor: C.ink,
                borderRadius: R.sm,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginRight: 12,
              },
              hardShadow(3, C.ink),
            ]}>
            <Text style={{fontFamily: FONT.display, fontSize: size * 0.5, color: C.ink}}>{index}</Text>
          </View>
        )}
        <Text
          style={{
            fontFamily: FONT.display,
            fontSize: size,
            lineHeight: size * 1.12,
            color: C.ink,
            flexShrink: 1,
          }}>
          {title}
        </Text>
      </View>

      {!!en && (
        <Text
          style={{
            fontFamily: FONT.body,
            fontWeight: W.bold,
            fontSize: 12,
            letterSpacing: 3,
            color: C.inkSoft,
            marginBottom: 6,
          }}>
          {en}
        </Text>
      )}
      {!!right && <View style={{marginLeft: 'auto', marginBottom: 4}}>{right}</View>}
    </View>
  );
}

/** 区块：标题 + 内容 + 统一竖向节奏 */
export function Section({
  index,
  title,
  en,
  color,
  right,
  children,
  headerSize,
  style,
}: SectionHeaderProps & {children?: React.ReactNode; headerSize?: number}) {
  return (
    <View style={[{marginBottom: 56}, style]}>
      <SectionHeader index={index} title={title} en={en} color={color} right={right} size={headerSize} />
      {/* 撞色双线：墨线 + 区块色线，比单线更有印刷海报的节奏感 */}
      <View style={{marginTop: 12, marginBottom: 24}}>
        <View style={{height: 3, backgroundColor: C.ink}} />
        <View style={{height: 3, backgroundColor: color ?? C.magenta, marginTop: 3, width: '62%'}} />
      </View>
      {children}
    </View>
  );
}
