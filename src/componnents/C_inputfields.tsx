import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function C_inputfields({
    value,
    icon,
    placeholder,
    secureTextEntry,
    onChangeText,
    style,
    containerstyle,
    size,
    color,
    iconstyle
     }: { 
        value: string, 
        icon?:any,
        placeholder: string,
        secureTextEntry:boolean, 
        onChangeText: (text: string) => void, 
        style?: any,
        containerstyle?: any,
        iconstyle?: any,
        size: number,
        color: string 
        }) 
    {

  return (
    <View style={[styles.container, containerstyle]}>
      {icon && <Ionicons name={icon} size={size} color={color} style={[styles.icon, iconstyle]} />}
      <TextInput style={[styles.input,style]}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    icon: { 
        position: 'absolute',
        left: 10, 
        top: 10 
    },
    container: {
        position: 'relative',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingLeft: 40, 
        justifyContent: 'center',
    },
    input: {
        width: 200,
        height: 40,
        paddingHorizontal: 10,
    },

})