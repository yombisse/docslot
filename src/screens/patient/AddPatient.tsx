// src/screens/AddPatientScreen.tsx
import { StyleSheet, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createPatient, updatePatient } from '../../services/patientService'
import C_inputfields from '../../componnents/C_inputfields'
import C_button from '../../componnents/C_button'
import C_text from '../../componnents/C_text'
import C_header from '../../componnents/C_header'
import C_appSelect from '../../componnents/C_appSelect'
import { validate } from '../../utils/fieldsValidator'
import PhoneInput from '../../componnents/C_phoneInput'
import { useToast } from '../../utils/ToastContext'

// Options pour le sexe
const sexeOptions = [
  { label: 'Masculin', value: 'Masculin' },
  { label: 'Féminin', value: 'Feminin' }
];

const AddPatient = ({ navigation, route }: any) => {
  const { showToast } = useToast();
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telephone, setTelephone] = useState('')
  const [profile_url, setProfil_url] = useState('')
  const [date_naissance, setDate_naissance] = useState('')
  const [adresse, setAdresse] = useState('')
  const [sexe, setSexe] = useState('')

  const Patient = route?.params?.patientData;
  const patientId = route?.params?.patientId;

  useEffect(() => {
    if (Patient) {
      setNom(Patient.nom);
      setPrenom(Patient.prenom);
      setEmail(Patient.email);
      setTelephone(Patient.telephone);
      setProfil_url(Patient.profile_url);
      setDate_naissance(Patient.date_naissance);
      setAdresse(Patient.adresse);
      setSexe(Patient.sexe);
    }
  }, [route.params?.patientData]);

  const handleCreateOrUpdate = async () => {
    const currentPatientId = Patient?.id_patient;
    
    // Validation des champs requis
    const error = validate(
      {
        nom,
        prenom,
        email,
        password: currentPatientId ? undefined : password, // Password requis seulement en création
        sexe,
      },
      {
        nom: { label: 'Nom', required: true },
        prenom: { label: 'Prénom', required: true },
        email: { label: 'Email', required: true, type: 'email' },
        password: { label: 'Mot de passe', required: !currentPatientId, minLength: 6 },
        sexe: { label: 'Sexe', required: true },
      }
    );

    if (error) {
      showToast(error, 'warning');
      return;
    }

    const payload = {
      nom,
      prenom,
      email,
      password: currentPatientId ? undefined : password, // Ne pas envoyer le password en update
      telephone,
      profile_url,
      date_naissance: date_naissance || null,
      adresse: adresse || null,
      sexe,
      role: 'patient', // Forcé côté serveur généralement, mais on peut l'envoyer
    };

    try {
      if (currentPatientId) {
        await updatePatient(currentPatientId, payload);
        showToast('Patient modifié avec succès', 'success');
        navigation.goBack();
      } else {
        await createPatient(payload);
        showToast('Patient ajouté avec succès', 'success');
        navigation.goBack();
      }

      // Reset form
      resetForm();

    } catch (error: any) {
      console.log(error.response?.data || error.message);
      showToast(error.response?.data?.message || 'Opération impossible', 'error');
    }
  };

  const resetForm = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setPassword('');
    setTelephone('');
    setProfil_url('');
    setDate_naissance('');
    setAdresse('');
    setSexe('');
  };

  return (
    <View style={{ flex: 1 }}>
      <C_header 
        icon='chevron-back' 
        text={patientId ? 'Modifier Patient' : 'Ajouter Patient'} 
        size={30} 
        onclickIcon={() => navigation.navigate('ListPatients')} 
      />
      
      <ScrollView contentContainerStyle={styles.container}>
        <C_text 
          text={patientId ? 'Modifier le patient' : 'Ajouter un patient'} 
          textstyle={styles.title} 
        />

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
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {!patientId && (
          <C_inputfields
            containerstyle={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        )}

        <PhoneInput
          value={telephone}
          onChange={setTelephone}
        />

        <C_inputfields
          containerstyle={styles.input}
          placeholder="Date de naissance (YYYY-MM-DD)"
          value={date_naissance}
          onChangeText={setDate_naissance}
        />

        <C_inputfields
          containerstyle={styles.input}
          placeholder="Adresse"
          value={adresse}
          onChangeText={setAdresse}
          multiline
          numberOfLines={2}
        />

        <C_appSelect
          label="Sexe"
          data={sexeOptions}
          value={sexe}
          onChange={setSexe}
          search={false}
        />

        <C_inputfields
          containerstyle={styles.input}
          placeholder="URL de la photo (optionnel)"
          value={profile_url}
          onChangeText={setProfil_url}
        />

        <C_button
          style={styles.button}
          onPress={handleCreateOrUpdate}
          title={patientId ? "Modifier le patient" : "Ajouter le patient"}
        />
      </ScrollView>
    </View>
  )
}

export default AddPatient

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