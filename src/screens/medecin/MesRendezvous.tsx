import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import C_AgendaPlanner, { Slot } from '../../componnents/C_Agenda';
import ModalGeneric from '../../componnents/C_Modal';
import { getMyRendezvous, cancelRendezvous, confirmRendezvous } from '../../services/rdvService';
import { getProfile } from '../../services/userService';
import { buildAgendaItems } from '../../utils/formateDate';

const MesRendezVous = ({ navigation }) => {
  const [agendaItems, setAgendaItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({});
  const [user, setUser] = useState({});

 const fetchProfileAndRdv = async () => {
    try {
        setLoading(true);
        setError('');

        // 1️⃣ Récupérer le profil utilisateur
        const resProfile = await getProfile();
        console.log("GetProfile",resProfile)
        if (!resProfile.data.success)
          console.log("Message d erreur dans MesRendezvous",error.message)

        const profileData = resProfile.data.data;
        setUser(profileData);

        const role = profileData.role;

        // 2️⃣ Récupérer les rendez-vous
        const resRdv = await getMyRendezvous();
        if (!resRdv.data.success || !resRdv.data.data) {
        setAgendaItems({});
        setError('Aucun rendez-vous trouvé');
        return;
        }

        // 3️⃣ Formater les rendez-vous pour l'agenda
        const formattedItems = buildAgendaItems(resRdv.data.data, (rdv) => {
        const patientName = `${rdv.patient_nom || ''} ${rdv.patient_prenom || ''}`.trim();
        const medecinName = `${rdv.medecin_nom || ''} ${rdv.medecin_prenom || ''}`.trim();

        return {
            id_rdv: rdv.id_rdv,
            date: rdv.date_rdv,
            time: rdv.heure_rdv?.slice(0, 5) || '00:00',
            name: role === 'medecin' ? patientName : medecinName,
            patientName: patientName,
            statut: rdv.statut || 'en_attente',
            motif: rdv.motif || 'Non précisé',
            specialite: rdv.specialite || '',
        };
        });

        setAgendaItems(formattedItems);

    } catch (err) {
        console.error(err);
        setAgendaItems({});
        setError('Erreur lors du chargement des rendez-vous');
    } finally {
        setLoading(false);
    }
    };
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileAndRdv();
    }, [])
  );

  // ================= ACTIONS =================
  const handleViewDetails = (slot: Slot) => {
    setSelectedSlot(slot);
    setModalVisible(true);
  };

  const handleCancelRdv = async () => {
    if (!selectedSlot) return;
    try {
      await cancelRendezvous(selectedSlot.id_rdv);
      setModalVisible(false);
      fetchProfileAndRdv();
    } catch (error) {
      console.log(error.message);
      Alert.alert('Erreur', "Impossible d'annuler le rendez-vous.");
    }
  };

  const handleConfirmRdv = async () => {
    if (!selectedSlot) return;
    try {
      await confirmRendezvous(selectedSlot.id_rdv); // inputValue = commentaire si médecin
      setModalVisible(false);
      fetchProfileAndRdv();
    } catch (error) {
      console.log(error.message);
      Alert.alert('Erreur', "Impossible de confirmer le rendez-vous.");
    }
  };

  // ================= RENDER =================
  const renderRdvSlot = (slot: Slot) => {
    const getStatutColor = (statut) => {
      switch (statut) {
        case 'confirme': return '#2BB673';
        case 'annule': return '#dc3545';
        case 'en_attente': default: return '#f0ad4e';
      }
    };

    return (
      <View style={[styles.slot, { borderLeftColor: getStatutColor(slot.statut) }]}>
        <Text style={styles.time}>{slot.time}</Text>
        <Text style={styles.name}>
          {user?.role === 'medecin' ? slot.patientName : slot.name}
        </Text>
        <Text style={{ color: getStatutColor(slot.statut), fontWeight: 'bold', marginTop: 4 }}>
          {slot.statut.toUpperCase()}
        </Text>

        <C_button
          icon={'eye'}
          size={20}
          color='orange'
          onPress={() => handleViewDetails(slot)}
          style={styles.viewButton}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2BB673" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : error && Object.keys(agendaItems).length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <C_AgendaPlanner
          items={agendaItems}
          renderSlot={renderRdvSlot}
        />
        
      )}
      <C_button
        title="+"
        onPress={() => navigation.navigate('AddRendezvous')}
        style={styles.addButtonFloating}
        textstyle={{ fontSize: 30, color: '#fff', fontWeight: 'bold' }}
      />
      <ModalGeneric
        visible={modalVisible}
        title="Détails du rendez-vous"
        details={[
          { label: user?.role === 'medecin' ? 'Patient' : 'Médecin', value: selectedSlot?.name || '' },
          { label: 'Date', value: selectedSlot?.date || '' },
          { label: 'Heure', value: selectedSlot?.time || '' },
          { label: 'Motif', value: selectedSlot?.motif || 'Non précisé' },
        ]}
        showInput={user?.role === 'medecin' && selectedSlot?.statut === 'en_attente'}
        inputPlaceholder="Commentaire / Motif"
        confirmText={user?.role === 'medecin' ? 'Confirmer RDV' : 'Annuler RDV'}
        cancelText="Fermer"
        onClose={() => setModalVisible(false)}
        onConfirm={user?.role === 'medecin' ? handleConfirmRdv : handleCancelRdv}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  errorText: { fontSize: 14, color: '#dc3545', textAlign: 'center', paddingHorizontal: 20 },
  slot: {
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  time: { fontWeight: 'bold', fontSize: 14, marginBottom: 4, color: '#333' },
  name: { fontSize: 13, color: '#555' },
  viewButton: { backgroundColor: 'transparent', borderRadius: 6, paddingVertical: 6 },
  addButtonFloating: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default MesRendezVous;