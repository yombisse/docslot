import { View, Text, StyleSheet } from 'react-native';
import React from 'react';


function Patients() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Gestion des Patients</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Patients;