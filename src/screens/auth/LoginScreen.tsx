import React from 'react';
import { Alert } from 'react-native';
import { loginUser } from '../../services/authService';
import {saveToken} from '../../store/tokenservice';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import C_button from '../../componnents/C_button';
import C_header from '../../componnents/C_header';
import C_inputfields from '../../componnents/C_inputfields';
import C_link from '../../componnents/C_link';
import C_text from '../../componnents/C_text';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;

      // Sauvegarde le token
      await saveToken(token);

      Alert.alert('Succès', 'Connexion réussie');

      // Redirection selon le rôle
      if (user.role === 'administrateur') {
        navigation.navigate('Admin', {
          screen: 'DashboardAdmin',
        });
      } else if (user.role === 'patient') {
        navigation.navigate('Patient', {
          screen: 'DashboardPatient',
          params: { userId: user.id },
        });
      } else if (user.role === 'medecin') {
        navigation.navigate('Medecin', {
          screen: 'DashboardMedecin',
        });
      } else {
        Alert.alert('Erreur', 'Rôle inconnu');
      }
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/fond.jpg")}
      style={styles.background}
      resizeMode="repeat"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <C_text text="Connectez-vous!" textstyle={styles.welcome} />
          <C_inputfields
            icon={"mail-outline"}
            size={24}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            containerstyle={styles.inputCard}
            iconstyle={styles.icon}
          />

          <C_inputfields
            icon={"lock-closed-outline"}
            size={24}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            containerstyle={styles.inputCard}
            iconstyle={styles.icon}
          />

          <C_button
            title="Login"
            onPress={handleLogin}
            style={styles.button}
          />

          <C_link
            text="Don't have an account? Register"
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          />
        </View>
        
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)', 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    margin: 20,
    elevation: 5,
  },
  inputCard: {
    marginBottom: 15,
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#2BB673', // vert santé
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#2BB673',
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    marginTop: 20,
    borderRadius: 15,
  },
  icon:{
    position: 'absolute',
    left: 15,
    top: 18,
    color: '#888',
  },
  logo:{
    width: 250,
    height: 250,
    borderRadius: 125,
    alignSelf: 'center',
  },
  welcome:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});