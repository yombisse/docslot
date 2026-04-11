import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import ModalGeneric from '../../componnents/C_Modal';
import { createRendezvous } from '../../services/rdvService';
import { getCreneauxByMedecin } from '../../services/medecinService';
import CustomFlatList from '../../componnents/C_Flatlist';
import { formatDate, formateTime, formatTime } from '../../utils/formateDate';
import { getEndTime } from '../../utils/getEndCreneau';

const MedecinCreneauxScreen = ({ route, navigation }) => {
  const { medecin } = route.params;

  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔥 REFRESH à chaque retour sur l'écran
  useFocusEffect(
    useCallback(() => {
      fetchCreneaux();
    }, [])
  );
const fetchCreneaux = async () => {
  try {
    setLoading(true);

    const res = await getCreneauxByMedecin(medecin.id_medecin);

    const now = Date.now();

    const filtered = res.data.data.filter((item) => {
      // 🔥 reconstruire proprement date + heure
      const date = item.date_creneau.split('T')[0]; // enlève timezone
      const datetimeStr = `${date}T${item.heure_creneau}`;

      const time = new Date(datetimeStr).getTime();

      return !isNaN(time) && time > now;
    });

    setCreneaux(filtered);

  } catch (err) {
    Alert.alert('Erreur', 'Impossible de charger les créneaux');
  } finally {
    setLoading(false);
  }
};
  const openModal = (creneau) => {
    setSelectedCreneau(creneau);
    setModalVisible(true);
  };

  const confirmRdv = async (motif) => {
  try {
    console.log("MOTIF REÇU =", motif);

    await createRendezvous({
      id_creneau: selectedCreneau.id_creneau,
      motif: motif,
    });

    setModalVisible(false);
    Alert.alert('Succès', 'Rendez-vous pris avec succès');
    fetchCreneaux();

  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);
    Alert.alert('Erreur', 'Créneau déjà réservé ou erreur serveur');
  }
};

  const renderItem = ({ item }) => (
    <Card style={styles.cardContainer} elevation={2}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.date}>{formatDate(item.date_creneau)}</Text>
            <Text style={styles.time}>
              {formateTime(item.heure_creneau)} - {getEndTime(item.heure_creneau, item.duree_creneau)}
            </Text>
          </View>

          <C_button
            title="Prendre RDV"
            style={styles.buttonRdv}
            onPress={() => openModal(item)}
          />
        </View>
      </Card.Content>
      <Divider />
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <C_header
        text={`Dr ${medecin.nom} ${medecin.prenom}`}
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.goBack()}
      />

      {loading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : (
        <CustomFlatList
          data={creneaux}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_creneau.toString()}
          title="Créneaux disponibles"
        />
      )}

      <ModalGeneric
        visible={modalVisible}
        title="Prendre rendez-vous"
        details={[
          { label: 'Médecin', value: `Dr ${medecin.nom} ${medecin.prenom}` },
          { label: 'Spécialité', value: medecin.specialite },
          { label: 'Date', value: formatDate(selectedCreneau?.date_creneau || '') },
          { label: 'Heure', value: `${formateTime(selectedCreneau?.heure_creneau || '')} - ${getEndTime(selectedCreneau?.heure_creneau || '', selectedCreneau?.duree_creneau || 0)}` },
        ]}
        showInput={true}
        inputPlaceholder="Motif du rendez-vous"
        confirmText="Confirmer"
        cancelText="Annuler"
        onClose={() => setModalVisible(false)}
        onConfirm={confirmRdv}
      />
    </View>
  );
};

export default MedecinCreneauxScreen;

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  buttonRdv:{
    justifyContent:'center',
    alignContent:'center',
    height:30,
    borderRadius:10,
    paddingHorizontal:10
  }
});