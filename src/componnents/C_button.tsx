import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function C_button({title,icon,iconstyle,size,color, onPress,style,textstyle}: {title: string; icon?:any; iconstyle?:any; size:number; color: string; onPress: () => void, style?: any, textstyle?: any}) {
  return (
    <TouchableOpacity style={[styles.button,style]} onPress={onPress}>
      {icon && <Ionicons name={icon} size={size} color={color} style={[styles.icon, iconstyle]} />}
      <Text style={[styles.text,textstyle]}>{title}</Text>
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