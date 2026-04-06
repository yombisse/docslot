import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function C_link({ text, onPress,icon, size, color,iconPress,iconstyle, style }: { text: string; onPress: () => void;icon?: string; size:number; color:string;iconPress?: () => void; iconstyle?: any; style?: any  }) {
  return (
    <View>
     {icon && <Ionicons name={icon} size={size} color={color} style={[styles.icon, iconstyle]} onPress={onPress} />}
      <Text onPress={onPress} style={[styles.text,style]}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
})