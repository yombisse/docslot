// src/screens/MesDisponibilites.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import C_AgendaPlanner, { Slot } from '../../componnents/C_Agenda';
import ModalGeneric from '../../componnents/C_Modal';
import { getMyDisponibilites, annulerDisponibilite } from '../../services/disponibiliteService';
import { buildAgendaItems, formatDate, formateDate, formateTime } from '../../utils/formateDate';
import { useToast } from '../../utils/ToastContext';

const MesDisponibilites = ({ navigation }: any) => {
  const { showToast } = useToast();
  const [agendaItems, setAgendaItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState({});
  const [selectedSlot, setSelectedSlot] = useState({});

  // ================= FETCH DISPONIBILITES =================
  const fetchDisponibilites = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyDisponibilites();
      console.log("Les disponibilite:",response.data.data);
      if (response.data.success && response.data.data) {
        setAgendaItems(
          buildAgendaItems(response.data.data, (dispo) => ({
            id: dispo.id,
            date: formateDate(dispo.date_disponibilite),
            heure_debut: formateTime(dispo.heure_debut),
            heure_fin: formateTime(dispo.heure_fin),
            patient_nom: dispo.rendezvous?.[0]?.patient?.nom || '',
            statut: dispo.etat,
            etat: dispo.etat,
            rendezvous_count: dispo.rendezvous?.length || 0,
          }))
        );
      } else {
        setAgendaItems({});
        setError('Aucune disponibilité trouvée');
      }
    } catch (err) {
      console.error(err);
      setAgendaItems({});
      setError('Erreur lors du chargement des disponibilités');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDisponibilites();
    }, [])
  );

  // ================= ACTIONS =================
  const handleModifySlot = (slot: Slot) => {
    navigation.navigate('AddDisponibilite', { slot });
  };

  const handleAnnulerSlot = async () => {
    if (!selectedSlot) return;
    try {
      await annulerDisponibilite(selectedSlot.id);
      setModalVisible(false);
      fetchDisponibilites();
    } catch {
      showToast("Impossible d'annuler le créneau", 'error');
    }
  };

  const openVoirPlusModal = (slot: Slot) => {
    setSelectedSlot(slot);
    setModalType('voirPlus');
    setModalVisible(true);
  };

  const openAnnulerModal = (slot: Slot) => {
    setSelectedSlot(slot);
    setModalType('annuler');
    setModalVisible(true);
  };

  // ================= RENDER SLOT =================
  const renderDisponibiliteSlot = (slot: Slot) => {
    let statusLabel = 'Libre';
    if (slot.statut === 'reserve') statusLabel = 'Réservé';
    else if (slot.statut === 'annule') statusLabel = 'Annulé';

    return (
      <View
        style={[
          styles.slot,
          {
            borderLeftColor:
              statusLabel === 'Libre'
                ? '#2BB673'
                : statusLabel === 'Réservé'
                ? '#ffc107'
                : '#dc3545',
          },
        ]}
      >
        <Text style={styles.time}>
          {slot.heure_debut} - {slot.heure_fin}
        </Text>
        <Text style={styles.status}>Statut : {statusLabel}</Text>
        {slot.patient_nom && <Text style={styles.name}>Patient : {slot.patient_nom}</Text>}

        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          <C_button
            title="Modifier"
            onPress={() => handleModifySlot(slot)}
            style={[styles.actionButton, { backgroundColor: '#2BB673' }]}
            textstyle={styles.actionButtonText}
          />
          <C_button
            title="Annuler"
            onPress={() => openAnnulerModal(slot)}
            style={[styles.actionButton, { backgroundColor: '#dc3545', marginLeft: 8 }]}
            textstyle={styles.actionButtonText}
          />
          <C_button
            title="Voir plus"
            onPress={() => openVoirPlusModal(slot)}
            style={[styles.actionButton, { backgroundColor: '#007bff', marginLeft: 8 }]}
            textstyle={styles.actionButtonText}
          />
        </View>
      </View>
    );
  };

  // ================= UI =================
  return (
    <View style={{ flex: 1 }}>
      <C_header icon="chevron-back" size={30} 
      text="Mes disponibilités"
      textStyle={{ fontSize: 18, fontWeight: 'bold',textAlign:'center',flex:1 }}
      onclickIcon={() => navigation.navigate('DashboardMedecin')} />

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
        <C_AgendaPlanner items={agendaItems} renderSlot={renderDisponibiliteSlot} />
      )}

      <C_button
        title="+"
        onPress={() => navigation.navigate('AddDisponibilite')}
        style={styles.addButtonFloating}
        textstyle={{ fontSize: 30, color: '#fff', fontWeight: 'bold' }}
      />

      {selectedSlot && modalType === 'voirPlus' && (
        <ModalGeneric
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Détails du créneau"
          details={[
            { label: 'Date', value: selectedSlot.date },
            { label: 'Heure', value: `${selectedSlot.heure_debut} - ${selectedSlot.heure_fin}` },
            { label: 'Statut', value: selectedSlot.statut },
            ...(selectedSlot.patient_nom ? [{ label: 'Patient', value: selectedSlot.patient_nom }] : []),
            { label: 'Nombre de RDV', value: `${selectedSlot.rendezvous_count}` },
          ]}
          confirmText="Fermer"
          cancelText=""
          onConfirm={() => setModalVisible(false)}
        />
      )}

      {selectedSlot && modalType === 'annuler' && (
        <ModalGeneric
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Confirmer l'annulation"
          details={[{ label: 'Créneau', value: `${selectedSlot.heure_debut} - ${selectedSlot.heure_fin}` }]}
          confirmText="Oui"
          cancelText="Non"
          onConfirm={handleAnnulerSlot}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  errorText: { fontSize: 14, color: '#dc3545', textAlign: 'center', paddingHorizontal: 20 },

  slot: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  time: { fontWeight: 'bold', fontSize: 14, marginBottom: 4, color: '#333' },
  name: { fontSize: 13, color: '#555' },
  status: { fontSize: 13, color: '#333' },
  actionButton: { flex: 1, borderRadius: 6, paddingVertical: 6 },
  actionButtonText: { color: '#fff', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },

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

export default MesDisponibilites;