import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function C_appSelect({
  label,
  data,
  value,
  onChange,
  placeholder = "Sélectionner",
  search = false,
  style
}:{
    label:string;
    data:{label:string, value:any}[];
    value:any;
    onChange:(value:any)=>void;
    placeholder?:string;
    search?:boolean;
    style?:any;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Dropdown
        style={[styles.dropdown,style, focus && styles.focused]}
        data={data}
        search={search}
        labelField="label"
        valueField="value"
        placeholder={!focus ? placeholder : '...'}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={item => {
          onChange(item.value);
          setFocus(false);
        }}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        inputSearchStyle={styles.searchInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  focused: {
    borderColor: '#3b82f6',
  },
  placeholder: {
    color: '#999',
  },
  selectedText: {
    color: '#000',
    fontWeight: '500',
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
  },
});