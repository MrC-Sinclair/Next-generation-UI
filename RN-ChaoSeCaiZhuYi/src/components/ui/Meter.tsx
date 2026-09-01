import React from 'react';
import {Text, View} from 'react-native';
import {BORDER, C, FONT, R, W} from '../../theme/tokens';

/** 进度条：粗描边 + 纯色填充，用于技能栈 */
export function Meter({
  value,
  color = C.magenta,
  height = 16,
  showValue,
}: {
  value: number;
  color?: string;
  height?: number;
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          flex: 1,
          height,
          borderWidth: BORDER.thin,
          borderColor: C.ink,
          borderRadius: R.pill,
          backgroundColor: C.paperDeep,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color,
            borderRightWidth: pct > 0 && pct < 100 ? BORDER.thin : 0,
            borderRightColor: C.ink,
          }}
        />
      </View>
      {showValue && (
        <Text
          style={{
            fontFamily: FONT.display,
            fontSize: 12,
            color: C.ink,
            marginLeft: 10,
            width: 34,
            textAlign: 'right',
          }}>
          {pct}
        </Text>
      )}
    </View>
  );
}

/** 五格评分点：比进度条更"粗野"的另一种表达 */
export function ScoreDots({level, color = C.cyan}: {level: number; color?: string}) {
  const filled = Math.round(level / 20);
  return (
    <View style={{flexDirection: 'row'}}>
      {[0, 1, 2, 3, 4].map(i => (
        <View
          key={i}
          style={{
            width: 12,
            height: 12,
            marginRight: 5,
            borderWidth: 2,
            borderColor: C.ink,
            borderRadius: i % 2 === 0 ? 0 : 6,
            backgroundColor: i < filled ? color : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

/** 数值标签：大数字 + 单位 */
export function StatNumber({value, unit, color}: {value: string; unit: string; color: string}) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      <Text style={{fontFamily: FONT.display, fontSize: 40, lineHeight: 40, color}}>{value}</Text>
      <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 14, color: C.ink, marginBottom: 5}}>
        {unit}
      </Text>
    </View>
  );
}
