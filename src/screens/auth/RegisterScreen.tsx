import { StyleSheet, Image, View ,ImageBackground} from 'react-native'
import React,{useState} from 'react'
import { registerUser } from '../../services/authService';
import C_button from '../../componnents/C_button';
import C_header from '../../componnents/C_header';
import C_inputfields from '../../componnents/C_inputfields';
import C_link from '../../componnents/C_link';
import C_text from '../../componnents/C_text';
import { useToast } from '../../utils/ToastContext';


export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    
    const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const confirmTrimmed = confirmPassword.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      showToast('Email est obligatoire', 'warning');
      return;
    }
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
    if (!confirmTrimmed) {
      showToast('Confirmation mot de passe est obligatoire', 'warning');
      return;
    }
    if (passwordTrimmed !== confirmTrimmed) {
      showToast('Les mots de passe ne correspondent pas', 'warning');
      return;
    }

    try {
      const response = await registerUser({
        email: emailTrimmed,
        password: passwordTrimmed,
      });

      showToast('Compte créé avec succès', 'success');
      navigation.replace('Login');

    } catch (error: any) {
      console.log('ERROR FULL:', error);
      console.log('ERROR RESPONSE:', error.response);
      console.log('ERROR MESSAGE:', error.message);
      showToast(error.response?.data?.message || 'Erreur inscription', 'error');
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
            <View style={styles.Card}>
              <Image source={require("../../assets/logo.png")} style={styles.logo} />
              <C_text text ="Inscrivez vous maintenant!" textstyle={styles.welcome}/>
              <C_inputfields 
                icon={"mail"}
                size={24}
                color="#888"
                placeholder="Email"
                placeholdercolor='black'
                secureTextEntry={false}
                value={email}
                onChangeText={setEmail}
                containerstyle={styles.inputCard}
                iconstyle={styles.icon}
                    />
                <C_inputfields 
                size={24}
                icon={"lock-closed"}
                color="#888"
                placeholder="Password" 
                secureTextEntry={true}
                placeholdercolor='black' 
                value={password}
                onChangeText={setPassword}
                containerstyle={styles.inputCard}  
                iconstyle={styles.icon}
                    />
                <C_inputfields 
                size={24}
                icon={"lock-closed"}
                color="#888"
                placeholder="Confirm Password" 
                secureTextEntry={true} 
                placeholdercolor='black'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                containerstyle={styles.inputCard}  
                iconstyle={styles.icon}
                    />
                    
                <C_button title="Register" 
                    onPress={handleRegister} 
                    style={styles.button}
                    loading={loading}
                    />
                <C_link text="Already registered? Login" size={14} color="#2BB673" icon={undefined as any} style={styles.link} onPress={() => navigation.navigate('Login')} />
            </View>
        </View>
    </ImageBackground>
  )
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
  Card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputCard: {
    marginBottom: 15,
    width: '100%',
    height: 60,
    borderRadius:100,
     borderWidth: 1,
     borderColor: '#ccc',
     paddingHorizontal: 10,
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
  icon: {
    position: 'absolute',
    left: 15,
    top: 18,
    color: '#888',
  },
  logo:{
    width: 250,
    height: 200,
    borderRadius: 125,
    alignSelf: 'center',
  },
  welcome:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
 
})