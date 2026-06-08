// src/screens/EditMedecinScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { updateMedecin } from '../../services/medecinService';

import C_header from '../../componnents/C_header';
import C_inputfields from '../../componnents/C_inputfields';
import C_button from '../../componnents/C_button';
import C_appSelect from '../../componnents/C_appSelect';
import PhoneInput from '../../componnents/C_phoneInput';
import { roles } from '../../constants/selectData';
import { useToast } from '../../utils/ToastContext';

const EditMedecinScreen = ({ navigation, route }: any) => {
  const { showToast } = useToast();
  const medecin = route?.params?.medecinData;
  const medecinId = route?.params?.medecinId;

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [profile_url, setProfil_url] = useState('');
  const [role, setRole] = useState('');

  // 🔥 Toujours recharger les données quand on revient sur l’écran
  useFocusEffect(
    useCallback(() => {
      if (medecin) {
        setNom(medecin.nom || '');
        setPrenom(medecin.prenom || '');
        setEmail(medecin.email || '');
        setTelephone(medecin.telephone || '');
        setSpecialite(medecin.specialite || '');
        setProfil_url(medecin.profile_url || '');
        setRole(medecin.role || '');
      }
    }, [medecin])
  );

  const handleUpdate = async () => {
    const payload = {
      nom,
      prenom,
      email,
      telephone,
      specialite,
      profile_url,
      role,
    };

    try {
      await updateMedecin(medecinId, payload);
      showToast('Médecin modifié avec succès', 'success');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      showToast('Modification impossible', 'error');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <C_header
        icon="chevron-back"
        text="Modifier Médecin"
        size={30}
        onclickIcon={() => navigation.navigate('ListMedecins')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <C_inputfields
          containerstyle={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />

        <C_inputfields
          containerstyle={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
        />

        <C_inputfields
          containerstyle={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <PhoneInput
          value={telephone}
          onChange={setTelephone}
        />

        <C_inputfields
          containerstyle={styles.input}
          placeholder="Spécialité"
          value={specialite}
          onChangeText={setSpecialite}
        />

        <C_inputfields
          containerstyle={styles.input}
          placeholder="URL Photo"
          value={profile_url}
          onChangeText={setProfil_url}
        />
        <C_button
          style={styles.button}
          title="Enregistrer les modifications"
          onPress={handleUpdate}
        />
      </ScrollView>
    </View>
  );
};

export default EditMedecinScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});