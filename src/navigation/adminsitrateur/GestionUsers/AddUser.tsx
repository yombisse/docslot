import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import C_inputfields from '../../../componnents/C_inputfields';
import C_button from '../../../componnents/C_button';
import C_appSelect from '../../../componnents/C_appSelect';
import { roles } from '../../../constants/selectData';
import { createUser, updateUser } from '../../../services/userService';

const AddEditUserScreen = ({ route, navigation }) => {
  const user = route?.params?.user; // si existe => modification
  const isEdit = !!user;

  const [nom, setNom] = useState(user?.nom || '');
  const [prenom, setPrenom] = useState(user?.prenom || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || '');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nom || !prenom || !email || !role) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        const Userdata = { 
          id_user: user.id_user,
          nom,
          prenom, 
          email, 
          role 
        };

        await updateUser(Userdata);
        Alert.alert('Succès', 'Utilisateur modifié avec succès');

      } else {
        if (!password) {
          Alert.alert('Erreur', 'Mot de passe obligatoire');
          return;
        }

        await createUser({ nom, prenom, email, role, password });
        Alert.alert('Succès', 'Utilisateur ajouté avec succès');
      }

      navigation.goBack();

    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <C_inputfields
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />

      <C_inputfields
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
      />

      <C_inputfields
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {!isEdit && (
        <C_inputfields
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      )}

      <C_appSelect
        label="Rôle"
        data={roles}
        value={role}
        onChange={setRole}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <C_button
          title={isEdit ? 'Modifier utilisateur' : 'Ajouter utilisateur'}
          onPress={handleSubmit}
        />
      )}
    </ScrollView>
  );
};

export default AddEditUserScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});