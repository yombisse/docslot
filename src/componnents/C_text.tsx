import React from "react";
import { StyleSheet, Text, View } from "react-native";


export default function C_text({ text, textstyle, style }: { text: string; textstyle?: any, style?: any }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text,textstyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
});