import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function C_header({
  children,
  text,
  icon,
  onclickIcon,
  size,
  color,
  iconstyle,
  textstyle,
  style,
}: {
  text: string;
  icon?: string;
  onclickIcon?: () => void;
  size?: number;
  color?: string;
  iconstyle?: any;
  textstyle?: any;
  style?: any;
  children?: React.ReactNode;
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        {icon && (
          <Ionicons
            name={icon}
            size={size || 24}
            color={color || "#fff"}
            style={[styles.icon, iconstyle]}
            onPress={onclickIcon}
          />
        )}
        <Text style={[styles.text, textstyle]}>{text}</Text>
      </View>
  
      <View style={styles.right}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2BB673", // couleur principale Docslot
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 3,
    height:100
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
});
