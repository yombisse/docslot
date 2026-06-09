import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
}: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 10 }, 
        style,
      ]}
    >
      <View style={styles.left}>
        {icon && (
          <TouchableOpacity onPress={onclickIcon}>
            <Ionicons
              name={icon}
              size={size || 24}
              color={color || "#fff"}
              style={iconstyle}
            />
          </TouchableOpacity>
        )}

        {text ? (
          <Text style={[styles.text, textstyle]} numberOfLines={1}>
            {text}
          </Text>
        ) : null}
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

    backgroundColor: "#2BB673",

    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  left: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
  },

  text: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    flexShrink: 1,
    textAlign: "center",
    marginLeft:60
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
});