import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createMedecin,updateMedecin } from '../../services/medecinService'
import C_inputfields from '../../componnents/C_inputfields'
import C_button from '../../componnents/C_button'
import C_text from '../../componnents/C_text'
import C_header from '../../componnents/C_header'
import C_appSelect from '../../componnents/C_appSelect'
import { roles } from '../../constants/selectData'
import { validate} from '../../utils/fieldsValidator'
import PhoneInput from '../../componnents/C_phoneInput'

const AddMedecin = ({navigation,route}) => {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [duree_creneau,setDureecreneau]=useState('30')
  const [telephone, setTelephone] = useState('')
  const [profile_url, setProfil_url] = useState('')
  const [specialite, setSpecialite] = useState('')
  const [role, setRole] = useState('')

  const Medecin = route?.params?.medecinData;
  const medecinId = route?.params?.medecinId;
  
  useEffect(() => {
      if (Medecin) {
        setNom(Medecin.nom);
        setPrenom(Medecin.prenom);
        setSpecialite(Medecin.specialite);
        setEmail(Medecin.email);
        setDureecreneau(Medecin.duree_creneau);
        setTelephone(Medecin.telephone);
        setRole(Medecin.role);
        setProfil_url(Medecin.profile_url);
      }
    }, [route.params?.medecinData]);

  const handleCreateOrUpdate = async () => {
    const medecinId = Medecin?.id_medecin;
    const error = validate(
      {
        nom,
        prenom,
        email,
        password,
        specialite,
        role,
        duree_creneau,
      },
      {
        nom: { label: 'Nom', required: true },
        prenom: { label: 'Prénom', required: true },
        email: { label: 'Email', required: true, type: 'email' },
        password: { label: 'Mot de passe', required: true, minLength: 6 },
        specialite: { label: 'Spécialité', required: true },
        role: { label: 'Rôle', required: true },
        duree_creneau:{label:'duree creneau',required:true},
      }
    );

    if (error) {
      Alert.alert('Erreur', error);
      return;
    }

    const payload = {
      nom,
      prenom,
      email,
      password,
      duree_creneau: parseInt(duree_creneau), // Assurez-vous que c'est un nombre
      telephone,
      profile_url,
      specialite,
      role,
    };

    try {
      if (medecinId) {
        await updateMedecin(medecinId, payload);
        Alert.alert('Succès', 'Médecin modifié avec succès');
        navigation.goBack();
      } else {
        await createMedecin(payload);
        Alert.alert('Succès', 'Médecin ajouté avec succès');
        navigation.goBack();
      }

      // Reset form
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');
      setTelephone('');
      setProfil_url('');
      setSpecialite('');
      setRole('');

    } catch (error) {
      console.log(error.message.response?.data || error.message);
      Alert.alert('Erreur', 'Opération impossible');
    }
  };

  return (
    <View style={{ flex: 1 }}>
    {
      medecinId ? (
        <C_header icon='chevron-back' text='Modifier Médecin' size={30} onclickIcon={()=>navigation.goBack()}/>
      ) : (
        <C_header icon='chevron-back' text='Ajouter Médecin' size={30} onclickIcon={()=>navigation.goBack()}/>
      )
    }
    <ScrollView contentContainerStyle={styles.container}>

      {medecinId ? (
        <C_text text='Modifier le médecin' textstyle={styles.title} />
      ) : (
        <C_text text='Ajouter un medecin' textstyle={styles.title} />
      )}

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
        placeholder="Duree creneau"
        value={duree_creneau}
        onChangeText={setDureecreneau}
      />
      
      <PhoneInput
        value={telephone}
        onChange={setTelephone} 
      />
      <C_inputfields
        containerstyle={styles.input}
        placeholder="URL de la photo (optionnel)"
        value={profile_url}
        onChangeText={setProfil_url}
      />  

      <C_appSelect
        label="Rôle"
        data={roles}
        value={role}
        onChange={setRole}
        search={false}
      />

      <C_button
        style={styles.button}
        onPress={handleCreateOrUpdate}
        title={medecinId ? "Modifier le médecin" : "Ajouter le médecin"}
      />
       
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