import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import C_button from '../../componnents/C_button';
import C_inputfields from '../../componnents/C_inputfields';
import C_appSelect from '../../componnents/C_appSelect';
import C_datetimePicker from '../../componnents/C_datetimePicker';
import PhoneInput from '../../componnents/C_phoneInput';
import { getProfile, updateUser } from '../../services/userService';
import { formateDate } from '../../utils/formateDate';
import C_header from '../../componnents/C_header';

const sexeOptions = [
  { label: 'Masculin', value: 'Masculin' },
  { label: 'Féminin', value: 'Feminin' },
];

const UpdateProfileScreen = ({ navigation }) => {
  const [role, setRole] = useState('');

  // Champs USER (communs)
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [profil_url, setProfilUrl] = useState('');

  // Champs PATIENT
  const [dateNaissance, setDateNaissance] = useState('');
  const [adresse, setAdresse] = useState('');
  const [sexe, setSexe] = useState('');

  // Champs MEDECIN
  const [specialite, setSpecialite] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data.data;

      setRole(data.role || '');

      setNom(data.nom || '');
      setPrenom(data.prenom || '');
      setEmail(data.email || '');
      setTelephone(data.telephone || '');
      setProfilUrl(data.profile_url || '');

      // Patient
      setDateNaissance(data.date_naissance || '');
      setAdresse(data.adresse || '');
      setSexe(data.sexe || '');

      // Medecin
      setSpecialite(data.specialite || '');

    } catch {
      Alert.alert('Erreur', 'Impossible de charger votre profil');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload: any = {
        nom: nom?.trim() || undefined,
        prenom: prenom?.trim() || undefined,
        email: email?.trim() || undefined,
        telephone: telephone?.trim() || undefined,
        profile_url: profil_url?.trim() || undefined,
      };

      if (role === 'patient') {
        if (dateNaissance) payload.date_naissance = formateDate(dateNaissance);
        if (adresse) payload.adresse = adresse;
        if (sexe) payload.sexe = sexe;
      }

      if (role === 'medecin') {
        if (specialite) payload.specialite = specialite;
      }

      const res = await updateUser(payload);

      if (res.data?.success) {
        Alert.alert('Succès', 'Profil mis à jour');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', res.data?.errors?.general || 'Mise à jour impossible');
      }

    } catch {
      Alert.alert('Erreur', 'Mise à jour impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <C_header icon='chevron-back' onclickIcon={()=>navigation.goBack()} text='Modification de votre profil' />
      <ScrollView contentContainerStyle={styles.Scrollcontainer}>
        <View style={styles.header}>
          {profil_url ? (
            <Image source={{ uri: profil_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {nom?.charAt(0)}{prenom?.charAt(0)}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{nom} {prenom}</Text>
        </View>

        {/* Champs USER */}
        <C_inputfields placeholder="Nom" value={nom} onChangeText={setNom} containerstyle={styles.input} />
        <C_inputfields placeholder="Prénom" value={prenom} onChangeText={setPrenom} containerstyle={styles.input} />
        <C_inputfields placeholder="Email" value={email} onChangeText={setEmail} containerstyle={styles.input} />
        <PhoneInput value={telephone} onChange={setTelephone} style={styles.input} />

        {/* Champs PATIENT */}
        {role === 'patient' && (
          <>
            <C_datetimePicker label="Date de naissance" value={dateNaissance} onChange={setDateNaissance} />
            <C_inputfields placeholder="Adresse" value={adresse} onChangeText={setAdresse} containerstyle={styles.input} />
            <C_appSelect label="Sexe" data={sexeOptions} value={sexe} onChange={setSexe} search={false} style={styles.input} />
          </>
        )}

        {/* Champs MEDECIN */}
        {role === 'medecin' && (
          <C_inputfields placeholder="Spécialité" value={specialite} onChangeText={setSpecialite} containerstyle={styles.input} />
        )}

        <C_button
          title={loading ? "Mise à jour..." : "Mettre à jour"}
          onPress={handleUpdate}
          style={styles.button}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  Scrollcontainer: { padding: 20, flexGrow: 1, backgroundColor: '#f9f9f9' },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#2BB673', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { 
    width:'100%',
    height:50,
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginVertical: 8, 
    borderRadius: 10, 
    backgroundColor: '#fff'
   },
  button: { padding: 15, borderRadius: 8, marginTop: 15, alignItems: 'center' },
});