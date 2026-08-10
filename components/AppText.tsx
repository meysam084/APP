import React from 'react';
import { Text, TextProps } from 'react-native';

export default function AppText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: 'Shabnam' }, props.style]} // 👈 اسم کلیدی که توی useFonts تعریف کردی
    >
      {props.children}
    </Text>
  );
}