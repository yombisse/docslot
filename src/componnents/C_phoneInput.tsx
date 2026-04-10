import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import C_appSelect from './C_appSelect';
import C_inputfields from './C_inputfields';
import { fetchCountries } from '../services/countryService';

export default function PhoneInput({ value, onChange, containerStyle, style }: { value: string, onChange: (text: string) => void, containerStyle?: any, style?: any }) {
  const [countries, setCountries] = useState([]);
  const [selectedCode, setSelectedCode] = useState('+226'); // Valeur par défaut
  const [phoneNumber, setPhoneNumber] = useState(""); // Stocke juste le numéro sans le code

  useEffect(() => {
    const loadCountries = async () => {
      const list = await fetchCountries();
      setCountries(list);
    };
    loadCountries();
  }, []);

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    onChange(`${selectedCode}${text}`); // envoie la valeur complète au parent
  };

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    onChange(`${code}${phoneNumber}`); // mettre à jour si le code change
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <C_appSelect
        label="Indicatif"
        data={countries}
        value={selectedCode}
        onChange={handleCodeChange}
        search={true}
      />
      <C_inputfields
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handlePhoneChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
});