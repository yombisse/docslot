import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const C_DateTimePicker = ({ label, value, onChange, mode, style }) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false); 
    if (selectedDate) onChange(selectedDate);
  };

  const displayValue = () => {
    if (!value) return '';
    if (mode === 'date') return value.toLocaleDateString();
    if (mode === 'time') return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return value.toLocaleString();
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.text}>{displayValue() || `Sélectionner ${mode}`}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display="default"
          onValueChange={handleChange}
        />
      )}
    </View>
  );
};

export default C_DateTimePicker;

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontWeight: '600', marginBottom: 4 },
  button: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, backgroundColor: '#fff' },
  text: { fontSize: 16 },
});