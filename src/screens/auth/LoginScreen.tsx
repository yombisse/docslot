import React from 'react';
import { loginUser } from '../../services/authService';
import {saveToken} from '../../store/tokenservice';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import C_button from '../../componnents/C_button';
import C_header from '../../componnents/C_header';
import C_inputfields from '../../componnents/C_inputfields';
import C_link from '../../componnents/C_link';
import C_text from '../../componnents/C_text';
import { useToast } from '../../utils/ToastContext';
// import { showSuccessToast } from '../../utils/errorHandler';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { showToast } = useToast();


  const handleLogin = async () : Promise<void> => {
    if (loading){
      setLoading(true);
      return;

    } 
    const emailTrimmed = email.trim();

    const passwordTrimmed = password.trim();

    if (!emailTrimmed) {
      showToast('Email est obligatoire', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      showToast('Format email invalide', 'warning');
      return;
    }

    if (!passwordTrimmed) {
      showToast('Mot de passe est obligatoire', 'warning');
      return;
    }

    if (passwordTrimmed.length < 6) {
      showToast('Mot de passe trop court (min 6 caractères)', 'warning');
      return;
    }

    try {
      const result = await loginUser(emailTrimmed, passwordTrimmed);
      if (!result.success) {
        setLoading(false);
        return; // Handled by service
        
      }

      const { token, user } = (result as any).data;

      await saveToken(token);

      showToast('Connexion réussie', 'success');

      // Redirection selon le rôle
      if (user.role === 'administrateur') {
        navigation.navigate('Admin', { screen: 'DashboardAdmin' });
      } else if (user.role === 'patient') {
        navigation.navigate('Patient', {
          screen: 'DashboardPatient',
          params: { userId: user.id },
        });
      } else if (user.role === 'medecin') {
        navigation.navigate('Medecin', { screen: 'DashboardMedecin' });
      } else {
        showToast('Rôle inconnu', 'error');
      }
    } finally {
      setLoading(false);
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
            color="#888"
            placeholder="Email"
            placeholdercolor="black"
            value={email}
            onChangeText={setEmail}
            containerstyle={styles.inputCard}
            iconstyle={styles.icon}
            secureTextEntry={false}
          />

          <C_inputfields
            icon={"lock-closed-outline"}
            size={24}
            color="#888"
            placeholder="Password"
            placeholdercolor="black"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            containerstyle={styles.inputCard}
            iconstyle={styles.icon}
          />

          <C_button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <C_link
            text="Don't have an account? Register"
            size={14}
            color="#2BB673"
            icon={undefined}
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