import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import C_DateTimePicker from '../../componnents/C_datetimePicker';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import {createDisponibilite} from '../../services/disponibiliteService';
import { formatDate,formatTime } from '../../utils/formateDate';
import C_inputfields from '../../componnents/C_inputfields';

const AddDisponibilite = ({ navigation, route }) => { // <-- Récupération de navigation et route
  const [date, setDate] = useState(null);
  const [heureDebut, setHeureDebut] = useState(null);
  const [heureFin, setHeureFin] = useState(null);

  const handlesave = async () => {
    if (!date || !heureDebut || !heureFin) {
      return alert("Veuillez remplir tous les champs !");
    }

    // Formatage sûr : ajout des secondes pour les heures si nécessaire
    const disponibiliteData = {
      date_disponibilite: formatDate(date),              // "YYYY-MM-DD"
      heure_debut: formatTime(heureDebut),
      heure_fin: formatTime(heureFin),
        // Convertir en nombre ou utiliser 30 par défaut
    };

    console.log("Données de disponibilité à envoyer:", disponibiliteData);

    try {
      const response = await createDisponibilite(disponibiliteData);

      // Axios renvoie la réponse complète sous response.data
      if (response?.data?.success) {
        alert("Disponibilité ajoutée avec succès !");
        navigation.goBack();
      } else {
        // Affiche le détail de l'erreur provenant du backend
        console.error("Erreur backend:", response?.data);
        alert(response?.data?.errors?.general || "Erreur inconnue");
      }
    } catch (error) {
      // Affiche le détail complet pour comprendre le 400
      console.error("Erreur lors de la création de la disponibilité:", error.response?.data || error.message);
      alert("Impossible de créer la disponibilité. Vérifie la console pour les détails.");
    }
  };
  return (
    <View style={styles.container}>
      <C_header
        icon="chevron-back"
        size={30}
        text="Définir une disponibilité"
        onclickIcon={() => navigation.goBack()} // <-- navigation utilisé correctement
      />

      <View style={styles.form}>
        <C_DateTimePicker
          label="Date de disponibilité"
          value={date}
          onChange={setDate}
          mode="date"
        />

        <C_DateTimePicker
          label="Heure de début"
          value={heureDebut}
          onChange={setHeureDebut}
          mode="time"
        />

        <C_DateTimePicker
          label="Heure de fin"
          value={heureFin}
          onChange={setHeureFin}
          mode="time"
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