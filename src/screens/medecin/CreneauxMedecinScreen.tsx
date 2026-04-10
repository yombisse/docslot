import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import ModalGeneric from '../../componnents/C_Modal';
import { createRendezvous } from '../../services/rdvService';
import { getCreneauxByMedecin } from '../../services/medecinService';
import CustomFlatList from '../../componnents/C_Flatlist';
import { formatDate, formatTime } from '../../utils/formateDate';
import { getEndTime } from '../../utils/getEndCreneau';

const MedecinCreneauxScreen = ({ route, navigation }) => {
  const { medecin } = route.params;

  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCreneaux();
  }, []);

  const fetchCreneaux = async () => {
    try {
      setLoading(true);
      const res = await getCreneauxByMedecin(medecin.id_medecin);
      setCreneaux(res.data.data);
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
      console.log("Données envoyées au backend:", {
        id_creneau: selectedCreneau.id_creneau,
        motif,
      });
      await createRendezvous({
        id_creneau: selectedCreneau.id_creneau,
        motif,
      });
      setModalVisible(false);
      Alert.alert('Succès', 'Rendez-vous pris avec succès');
      fetchCreneaux();
    } catch (error) {
      console.error("Erreur de prise de rdv:", error.message);
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
              {formatTime(item.heure_creneau)} - {getEndTime(item.heure_creneau, item.duree_creneau)}
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

      {/* Modal générique avec champ motif */}
      <ModalGeneric
        visible={modalVisible}
        title="Prendre rendez-vous"
        details={[
          { label: 'Médecin', value: `Dr ${medecin.nom} ${medecin.prenom}` },
          { label: 'Spécialité', value: medecin.specialite },
          { label: 'Date', value: formatDate(selectedCreneau?.date_creneau || '') },
          { label: 'Heure', value: `${formatTime(selectedCreneau?.heure_creneau || '')} - ${getEndTime(selectedCreneau?.heure_creneau || '', selectedCreneau?.duree_creneau || 0)}` },
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