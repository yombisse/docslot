import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react';

export default function C_button({title, onPress,style,textstyle}: {title: string, onPress: () => void, style?: any, textstyle?: any}) {
  return (
    <TouchableOpacity style={[styles.button,style]} onPress={onPress}>
      <Text style={[styles.text,textstyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2BB673',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
})