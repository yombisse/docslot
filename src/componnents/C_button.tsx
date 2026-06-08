import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react';
// @ts-expect-error: react-native-vector-icons typings may be missing
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function C_button({
  title,
  loading = false,
  icon,
  iconstyle,
  size,
  color,
  onPress,
  style,
  textstyle,
}: {
  title: string;
  loading?: boolean;
  icon?: any;
  iconstyle?: any;
  size?: number;
  color?: string;
  onPress: (() => void) | undefined;
  style?: any;
  textstyle?: any;
  [key: string]: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, style, loading ? { opacity: 0.7 } : null]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff"  />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size || 20}
              color={color || '#fff'}
              style={[styles.icon, iconstyle]}
            />
          )}
          <Text style={[styles.text, textstyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2BB673',
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
})