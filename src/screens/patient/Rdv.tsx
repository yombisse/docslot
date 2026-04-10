import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { getMyRendezvous } from '../../services/rdvService';
import { getProfile } from '../../services/userService';
import C_button from '../../componnents/C_button';
import ModalGeneric from '../../componnents/C_Modal';
import C_RdvDetailsModal from '../../componnents/C_modalConfirm';

export default function PatientAgendaScreen() {

  const [sections, setSections] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('agenda');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const profileRes = await getProfile();
      const profile = profileRes.data.data;
      setUser(profile);

      const rdvRes = await getMyRendezvous(view);
      const rdvs = rdvRes.data.data || [];

      const grouped = {};

      rdvs.forEach((rdv) => {

        const date = new Date(rdv.date_rdv).toLocaleDateString(
          'fr-FR',
          { weekday: 'long', day: 'numeric', month: 'long' }
        );

        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(rdv);
      });

      const sectionsData = Object.keys(grouped)
        .sort()
        .map((date) => ({
          title: date,
          data: grouped[date],
        }));

      setSections(sectionsData);

    } catch (err) {
      console.error('Erreur agenda:', err);
    } finally {
      setLoading(false);
    }
  };
  

  // ================= STATUS BADGE =================
  const StatusBadge = ({ statut }) => {

    const config = {
      confirme: { bg: '#e8f5e9', color: '#2e7d32', text: 'CONFIRMÉ' },
      en_attente: { bg: '#fff8e1', color: '#f9a825', text: 'EN ATTENTE' },
      annule: { bg: '#ffebee', color: '#c62828', text: 'ANNULÉ' },
    };

    const current = config[statut] || config.en_attente;

    return (
      <View style={[styles.badge, { backgroundColor: current.bg }]}>
        <Text style={[styles.badgeText, { color: current.color }]}>
          {current.text}
        </Text>
      </View>
    );
  };

  // ================= RENDER ITEM =================
  const renderItem = ({ item }) => {

  const isMedecin = user?.role === 'medecin';

  const name = isMedecin
    ? `${item.patient_nom || ''} ${item.patient_prenom || ''}`.trim()
    : `${item.medecin_nom || ''} ${item.medecin_prenom || ''}`.trim();

  return (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
        style={styles.card}
      >

        {/* TIME BLOCK */}
        <View style={styles.timeBox}>
          <Text style={styles.time}>
            {item.heure_rdv?.slice(0, 5)}
          </Text>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          <Text style={styles.title}>
            {item.motif} - {name}
          </Text>

          {/* BADGE */}
          <StatusBadge statut={item.statut} />

        </View>

      </TouchableOpacity>
    );
  };
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id_rdv.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.dateTitle}>
            {section.title}
          </Text>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <C_button
        title={view === 'agenda' ? 'Voir Historique' : 'Voir Agenda'}
        onPress={() =>
          setView(view === 'agenda' ? 'historique' : 'agenda')
        }
        style={styles.historyBtn}
        textstyle={styles.historyText}
      />
      
      <C_RdvDetailsModal
        visible={modalVisible}
        rdv={selectedItem}
        role={user?.role}
        onClose={() => setModalVisible(false)}
      />

    </View>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
    padding: 15,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  list: {
    paddingBottom: 100,
  },

  dateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginVertical: 12,
    textTransform: 'capitalize',
  },

  card: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,

  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
},
  // TIME BLOCK
  timeBox: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    marginRight: 10,
  },

  time: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2BB673',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },

  // ================= BADGE =================
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ================= BUTTON =================
  historyBtn: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#2BB673',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  historyText: {
    color: '#fff',
    fontWeight: '700',
  },
});