import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import C_text from '../../componnents/C_text';
import C_inputfields from '../../componnents/C_inputfields';
import C_appSelect from '../../componnents/C_appSelect';
import { getProfile, updateUser } from '../../services/userService';
import { useToast } from '../../utils/ToastContext';
import C_DateTimePicker from '../../componnents/C_datetimePicker';

export default function ProfilePatient({ navigation }: any) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [id_user, setIdUser] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [adresse, setAdresse] = useState('');
  const [sexe, setSexe] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [role, setRole] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await getProfile();
      const data = res?.data?.data;

      setIdUser(data.id_user);
      setNom(data.nom || '');
      setPrenom(data.prenom || '');
      setEmail(data.email || '');
      setTelephone(data.telephone || '');
      setAdresse(data.adresse || '');
      setSexe(data.sexe || '');
      setDateNaissance(data.date_naissance || '');
      setRole(data.role || '');
    } catch (e) {
      showToast('Impossible de charger le profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const payload = {
        id_user,
        nom,
        prenom,
        email,
        telephone,
        adresse,
        date_naissance: dateNaissance,
        role,
        sexe,
        ...(password.trim() !== '' && { password }),
      };

      const response = await updateUser(payload);

      if (response?.data?.success) {
        showToast('Profil mis à jour', 'success');
        navigation.goBack();
      } 
    } catch (error: any) {
      const errors = error?.data?.errors || error?.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0] as string;
        showToast(firstError, 'error');
      } else {
        showToast(
          error?.data?.message ||
          error?.response?.data?.message ||
          'Mise à jour impossible',
          'error'
        );
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <C_header
        text="Mon profil"
        icon="chevron-back"
        onclickIcon={() => navigation.navigate('DashboardPatient')}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>

          <C_text text="Informations personnelles" textstyle={styles.title} />

          <C_inputfields
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
            containerstyle={styles.input}
          />

          <C_inputfields
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
            containerstyle={styles.input}
          />

          <C_inputfields
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            containerstyle={styles.input}
          />

          <C_inputfields
            placeholder="Téléphone"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            containerstyle={styles.input}
          />

          <C_inputfields
            placeholder="Adresse"
            value={adresse}
            onChangeText={setAdresse}
            containerstyle={styles.input}
          />

          <C_appSelect
            label="Sexe"
            value={sexe}
            onChange={setSexe}
            placeholder="Sélectionner le sexe"
            data={[
              { label: 'Masculin', value: 'Masculin' },
              { label: 'Féminin', value: 'Feminin' },
            ]}
          />

          <C_DateTimePicker
            label="Date de naissance"
            value={dateNaissance ? new Date(dateNaissance) : null}
            mode="date"
            onChange={(date) =>
              setDateNaissance(date.toISOString().split('T')[0])
            }
            style={styles.input}
          />

          <View style={styles.roleBox}>
            <C_text text={`Rôle : ${role}`} textstyle={styles.roleText} />
          </View>

          <C_inputfields
            placeholder="Nouveau mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerstyle={styles.input}
          />

          <C_button
            title="Mettre à jour"
            onPress={handleUpdate}
            style={styles.button}
          />

        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f9',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scroll: {
    paddingBottom: 30,
  },

  card: {
    margin: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#1f2937',
  },

  input: {
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
  },

  button: {
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  roleBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eef2ff',
    borderRadius: 10,
  },

  roleText: {
    fontWeight: '600',
    color: '#3730a3',
  },
});