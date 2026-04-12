import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';

import C_inputfields from '../../../componnents/C_inputfields';
import C_button from '../../../componnents/C_button';
import C_appSelect from '../../../componnents/C_appSelect';
import C_header from '../../../componnents/C_header';
import { roles } from '../../../constants/selectData';
import { createUser, updateUser } from '../../../services/userService';

const AddEditUserScreen = ({ route, navigation }) => {
  const user = route?.params?.userData; 
  const isEdit = !!user;

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // ✅ INIT FROM LIST DATA (NO API)
  useEffect(() => {
    if (isEdit && user) {
      setNom(user.nom);
      setPrenom(user.prenom);
      setEmail(user.email);
      setRole(user.role);
    }
  }, []);

  const handleSubmit = async () => {
    if (!nom || !prenom || !email || !role) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    if (!isEdit && !password) {
      Alert.alert('Erreur', 'Mot de passe obligatoire pour création');
      return;
    }

    try {
      setLoading(true);

      let result;

      if (isEdit) {
        result = await updateUser({
          id_user: user.id_user,
          nom,
          prenom,
          email,
          role,
        });
      } else {
        result = await createUser({
          nom,
          prenom,
          email,
          role,
          password,
        });
      }

      if (!result.success) return;

      Alert.alert(
        'Succès',
        isEdit ? 'Utilisateur modifié avec succès' : 'Compte créé avec succès'
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <C_header
        icon="chevron-back"
        text={isEdit ? 'Modifier utilisateur' : 'Créer utilisateur'}
        size={28}
        onclickIcon={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {isEdit ? 'Modifier un utilisateur' : 'Créer un compte'}
        </Text>

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
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          containerstyle={styles.input}
        />

        {!isEdit && (
          <C_inputfields
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            containerstyle={styles.input}
          />
        )}

        <C_appSelect
          label="Sélectionner un rôle"
          data={roles}
          value={role}
          onChange={setRole}
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2BB673" />
          ) : (
            <C_button
              title={isEdit ? 'Modifier' : 'Créer le compte'}
              onPress={handleSubmit}
              style={styles.button}
              textstyle={styles.buttonText}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddEditUserScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2BB673',
  },

  sectionLabel: {
    marginTop: 15,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },

  buttonContainer: {
    marginTop: 20,
  },

  button: {
    backgroundColor: '#2BB673',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent:'center',
    alignItems:'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});