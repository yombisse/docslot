import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import C_AgendaPlanner, { Slot } from '../../componnents/C_Agenda';
import ModalGeneric from '../../componnents/C_Modal';

import {
  getMyRendezvous,
  cancelRendezvous,
  confirmRendezvous,
  getAllRendezvous
} from '../../services/rdvService';

import { getProfile } from '../../services/userService';
import { buildAgendaItems } from '../../utils/formateDate';

const MesRendezVous = ({ navigation }) => {
  const [agendaItems, setAgendaItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>({});
  const [user, setUser] = useState<any>({});

  
  const fetchProfileAndRdv = async () => {
    try {
      setLoading(true);
      setError('');
      
      const resProfile = await getProfile();

      if (!resProfile?.data?.success) {
        setError("Erreur chargement profil");
        return;
      }

      const profileData = resProfile.data.data;
      setUser(profileData);

      const role = profileData.role;

    
      let resRdv;

      if (role === 'admin') {
        resRdv = await getAllRendezvous(); 
      } else {
        resRdv = await getMyRendezvous();
      }

      const rdvList = resRdv?.data?.data;

      if (!Array.isArray(rdvList)) {
        setAgendaItems({});
        setError('Aucun rendez-vous trouvé');
        return;
      }

      console.log('RDV RAW =>', rdvList);

  
      const formattedItems = buildAgendaItems(rdvList, (rdv) => {
        const patientName =
          `${rdv.patient_nom ?? ''} ${rdv.patient_prenom ?? ''}`.trim();

        const medecinName =
          `${rdv.medecin_nom ?? ''} ${rdv.medecin_prenom ?? ''}`.trim();

        return {
          id_rdv: rdv.id_rdv,
          date: rdv.date_rdv ?? '',
          time: rdv.heure_rdv?.slice(0, 5) ?? '00:00',

        
          name:
            role === 'admin'
              ? `${patientName} → ${medecinName}`
              : role === 'medecin'
              ? patientName
              : medecinName,

          patientName,
          medecinName,

          statut: rdv.statut ?? 'en_attente',
          motif: rdv.motif ?? 'Non précisé',
          specialite: rdv.specialite ?? '',
        };
      });

      setAgendaItems(formattedItems);
    } catch (err) {
      console.error('RDV ERROR:', err);
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


  const handleViewDetails = (slot: Slot) => {
    setSelectedSlot(slot);
    setModalVisible(true);
  };

  const handleCancelRdv = async () => {
    try {
      await cancelRendezvous(selectedSlot.id_rdv);
      setModalVisible(false);
      fetchProfileAndRdv();
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'annuler le rendez-vous.");
    }
  };

  const handleConfirmRdv = async () => {
    try {
      await confirmRendezvous(selectedSlot.id_rdv);
      setModalVisible(false);
      fetchProfileAndRdv();
    } catch (error) {
      Alert.alert('Erreur', "Impossible de confirmer le rendez-vous.");
    }
  };


  const renderRdvSlot = (slot: Slot) => {
    const getStatutColor = (statut: string) => {
      switch (statut) {
        case 'confirme':
          return '#2BB673';
        case 'annule':
          return '#dc3545';
        case 'en_attente':
        default:
          return '#f0ad4e';
      }
    };

    return (
      <View
        style={[
          styles.slot,
          { borderLeftColor: getStatutColor(slot.statut) },
        ]}
      >
        <Text style={styles.time}>{slot.time}</Text>

        <Text style={styles.name}>
          {slot.name ?? 'Non défini'}
        </Text>

        <Text
          style={{
            color: getStatutColor(slot.statut),
            fontWeight: 'bold',
            marginTop: 4,
          }}
        >
          {slot.statut?.toUpperCase()}
        </Text>

        <C_button
          icon="eye"
          size={20}
          color="orange"
          onPress={() => handleViewDetails(slot)}
          style={styles.viewButton}
        />
      </View>
    );
  };


  return (
    <View style={{ flex: 1 }}>
      <C_header
        text="Mes Rendez-vous"
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.goBack()}
      />

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
        <C_AgendaPlanner items={agendaItems} renderSlot={renderRdvSlot} />
      )}

      
      {user?.role === 'admin' && (
        <C_button
          title="+"
          onPress={() => navigation.navigate('AddRendezvous')}
          style={styles.addButtonFloating}
          textstyle={{ fontSize: 30, color: '#fff', fontWeight: 'bold' }}
        />
      )}

      <ModalGeneric
        visible={modalVisible}
        title="Détails du rendez-vous"
        details={[
          {
            label: user?.role === 'medecin' ? 'Patient' : 'Médecin',
            value: selectedSlot?.name || '',
          },
          { label: 'Date', value: selectedSlot?.date || '' },
          { label: 'Heure', value: selectedSlot?.time || '' },
          { label: 'Motif', value: selectedSlot?.motif || '' },
        ]}
        showInput={user?.role === 'medecin' && selectedSlot?.statut === 'en_attente'}
        inputPlaceholder="Commentaire"
        confirmText={
          user?.role === 'medecin' ? 'Confirmer RDV' : 'Annuler RDV'
        }
        cancelText="Fermer"
        onClose={() => setModalVisible(false)}
        onConfirm={
          user?.role === 'medecin' ? handleConfirmRdv : handleCancelRdv
        }
      />
    </View>
  );
};

export default MesRendezVous;


const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  slot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  time: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  name: { fontSize: 13, color: '#555' },
  viewButton: { backgroundColor: 'transparent', paddingVertical: 6 },
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
  },
});