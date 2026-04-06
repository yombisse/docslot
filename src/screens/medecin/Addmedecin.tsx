import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { createMedecin } from '../../services/medecinService'
import C_inputfields from '../../componnents/C_inputfields'
import C_button from '../../componnents/C_button'
import C_text from '../../componnents/C_text'
import C_header from '../../componnents/C_header'

const AddMedecin = ({navigation}) => {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telephone, setTelephone] = useState('')
  const [photo_url, setPhoto_url] = useState('')
  const [specialite, setSpecialite] = useState('')

  const handleAdd = async () => {
    if (!nom || !prenom || !specialite) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs')
      return
    }

    try {
      const response = await createMedecin({ nom, prenom, specialite })
      Alert.alert('Succès', 'Médecin ajouté avec succès')
      setNom('')
      setPrenom('')
      setSpecialite('')
    } catch (error) {
      console.log(error)
      Alert.alert('Erreur', 'Impossible d\'ajouter le médecin')
    }
  }

  return (
    <View style={{ flex: 1 }}>
    <C_header icon='chevron-back' size={30} onclickIcon={()=>navigation.goBack()}/>
    <ScrollView contentContainerStyle={styles.container}>

      <C_text text='Ajouter un medecin' textstyle={styles.title} />

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
        placeholder="Spécialité"
        value={specialite}
        onChangeText={setSpecialite}
      />
      <C_inputfields
        containerstyle={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <C_inputfields
        containerstyle={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <C_inputfields
        containerstyle={styles.input}
        placeholder="Téléphone "
        value={telephone}
        onChangeText={setTelephone}
      />
      <C_inputfields
        containerstyle={styles.input}
        placeholder="URL de la photo (optionnel)"
        value={photo_url}
        onChangeText={setPhoto_url}
      />  


      <C_button style={styles.button} onPress={handleAdd} title="Ajouter le médecin" />
       
    </ScrollView>
    </View>
  )
}

export default AddMedecin

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})