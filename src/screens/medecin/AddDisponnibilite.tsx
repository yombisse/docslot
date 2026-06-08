import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import C_DateTimePicker from '../../componnents/C_datetimePicker';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import {createDisponibilite} from '../../services/disponibiliteService';
import { formatDate,formatTime } from '../../utils/formateDate';

import { useToast } from '../../utils/ToastContext';

const AddDisponibilite = ({ navigation, route }: any) => {
  const { showToast } = useToast();
  const [date, setDate] = useState(null);
  const [heureDebut, setHeureDebut] = useState(null);
  const [heureFin, setHeureFin] = useState(null);

  const handlesave = async () => {
    if (!date || !heureDebut || !heureFin) {
      showToast('Veuillez remplir tous les champs', 'warning');
      return;
    }

    // Formatage sûr : ajout des secondes pour les heures si nécessaire
    const disponibiliteData = {
      date_disponibilite: formatDate(date),              // "YYYY-MM-DD"
      heure_debut: formatTime(heureDebut),
      heure_fin: formatTime(heureFin),
        // Convertir en nombre ou utiliser 30 par défaut
    };

    try {
      const response = await createDisponibilite(disponibiliteData);

      if (response?.data?.success) {
        showToast('Disponibilité ajoutée avec succès', 'success');
        navigation.navigate('MesDisponnibilites');
      } else {
        // Affiche le détail de l'erreur provenant du backend
        console.error("Erreur backend:", response?.data);
        const errorMsg = response?.data?.errors?.general || response?.data?.message || 'Erreur inconnue';
        
        // Gérer spécifiquement le cas où le créneau est déjà pris
        if (errorMsg.toLowerCase().includes('déjà') || errorMsg.toLowerCase().includes('déjà') || errorMsg.toLowerCase().includes('existe') || errorMsg.toLowerCase().includes('chevauchement')) {
          showToast('Ce créneau est déjà pris ou chevauche une autre disponibilité', 'error');
        } else {
          showToast(errorMsg, 'error');
        }
      }
    } catch (error: any) {
      // Affiche le détail complet pour comprendre le 400
      console.error("Erreur lors de la création de la disponibilité:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.general || 'Impossible de créer la disponibilité';
      
      // Gérer spécifiquement le cas où le créneau est déjà pris
      if (errorMsg.toLowerCase().includes('déjà') || errorMsg.toLowerCase().includes('déjà') || errorMsg.toLowerCase().includes('existe') || errorMsg.toLowerCase().includes('chevauchement')) {
        showToast('Ce créneau est déjà pris ou chevauche une autre disponibilité', 'error');
      } else {
        showToast(errorMsg, 'error');
      }
    }
  };
  return (
    <View style={styles.container}>
      <C_header
        icon="chevron-back"
        size={30}
        text="Définir une disponibilité"
        onclickIcon={() => navigation.navigate('MesDisponnibilites')}
      />


      <View style={styles.form}>
        <C_DateTimePicker
          label="Date de disponibilité"
          value={date}
          onChange={setDate}
          mode="date"
          style={{}}
        />


        <C_DateTimePicker
          label="Heure de début"
          value={heureDebut}
          onChange={setHeureDebut}
          mode="time"
          style={{}}
        />


        <C_DateTimePicker
          label="Heure de fin"
          value={heureFin}
          onChange={setHeureFin}
          mode="time"
          style={{}}
        />


      </View>
      <C_button
        title="Enregistrer"
        style={styles.button}
        textstyle={styles.buttontext}
        onPress={handlesave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop:"30%",
  },
  button: {
    margin: 16,
    height: 50,
    width: '80%',
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
  },  
  buttontext: {
    fontSize: 18,
    textAlign: 'center',
    margin: 5,

  },
});

export default AddDisponibilite;