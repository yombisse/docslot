import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileMenu = ({
  navigation,
  icon = "person-circle-outline",
  items = [],
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* ICON */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Ionicons name={icon} size={28} color="#000" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.menu}>

            {/* ITEMS COMPLETEMENT DYNAMIQUES */}
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={async () => {
                  setVisible(false);
                  if (item.onPress) await item.onPress();
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.color || "#333"}
                />
                <Text style={[styles.label, item.color && { color: item.color }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}

          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ProfileMenu;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 15,
  },

  menu: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 6,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },

  label: {
    fontSize: 14,
    color: '#333',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },

  logoutText: {
    color: 'red',
    fontWeight: 'bold',
  },
});