import React from 'react';
import { Text, TextProps } from 'react-native';

export default function AppTextBold(props: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: 'ShabnamBold' }, props.style]} // 👈 نسخه بولد
    >
      {props.children}
    </Text>
  );
}