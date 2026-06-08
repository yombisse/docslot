import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import C_text from '../../componnents/C_text';

import { getProfile, updateUser } from '../../services/userService';
import C_inputfields from '../../componnents/C_inputfields';
import { useToast } from '../../utils/ToastContext';

export default function ProfileMedecin({ navigation }: any) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  // USER
  const [id_user, setIdUser] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');

  // MEDICAL INFO
  const [specialite, setSpecialite] = useState('');
  const [dureeCreneau, setDureeCreneau] = useState('');

  // READ ONLY
  const [role, setRole] = useState('');

  // ================= LOAD =================
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
      setSpecialite(data.specialite || '');
      setDureeCreneau(String(data.duree_creneau || '30'));
      setRole(data.role || '');

    } catch (e) {
      console.log(e);
      showToast('Impossible de charger le profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {

      const payload = {
        id_user,
        nom,
        prenom,
        email,
        telephone,
        role,

        specialite,
        duree_creneau: parseInt(dureeCreneau || 30),

        ...(password.trim() !== '' && { password }),
      };

      await updateUser(payload);

      showToast('Profil mis à jour', 'success');
      navigation.goBack();

    } catch (e) {
      console.log(e);
      showToast('Mise à jour échouée', 'error');
    }
  };

  // ================= LOADING =================
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
        icon="chevron-back"
        text="Mon profil médecin"
        onclickIcon={() => navigation.navigate('DashboardMedecin')}
      />

      <ScrollView>
        <View style={styles.form}>

          <C_text text="Informations personnelles" textstyle={styles.title} />

          <C_inputfields placeholder="Nom" value={nom} onChangeText={setNom} />
          <C_inputfields placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
          <C_inputfields placeholder="Email" value={email} onChangeText={setEmail} />
          <C_inputfields placeholder="Téléphone" value={telephone} onChangeText={setTelephone} />

          <C_text text="Informations médicales" textstyle={styles.subtitle} />

          <C_inputfields placeholder="Spécialité" value={specialite} onChangeText={setSpecialite} />
          <C_inputfields placeholder="Durée créneau (minutes)" value={dureeCreneau} onChangeText={setDureeCreneau} />

          <C_text text={`Rôle : ${role}`} textstyle={styles.role} />

          <C_inputfields
            placeholder="Nouveau mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
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
    backgroundColor: '#f6f8fb',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: {
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2BB673',
  },

  role: {
    marginTop: 10,
    fontWeight: 'bold',
  },

  button: {
    marginTop: 25,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});