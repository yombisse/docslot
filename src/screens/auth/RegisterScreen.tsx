import { Alert, StyleSheet, Image, View ,ImageBackground} from 'react-native'
import React,{useState} from 'react'
import { registerUser } from '../../services/authService';
import C_button from '../../componnents/C_button';
import C_header from '../../componnents/C_header';
import C_inputfields from '../../componnents/C_inputfields';
import C_link from '../../componnents/C_link';
import C_text from '../../componnents/C_text';


export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleRegister = async () => {
    try {
      const response = await registerUser({
        email,
        password,
      });

      Alert.alert('Succès', 'Compte créé avec succès');
      navigation.replace('Login');

    } catch (error) {
      console.log('ERROR FULL:', error);
      console.log('ERROR RESPONSE:', error.response);
      console.log('ERROR MESSAGE:', error.message);
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur inscription');
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
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                containerstyle={styles.inputCard}
                iconstyle={styles.icon}
                    />
                <C_inputfields 
                size={24}
                icon={"lock-closed"}
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
                    />
                <C_link text="Already registered? Login" style={styles.link} onPress={() => navigation.navigate('Login')} />
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