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
import C_RdvDetailsModal from '../../componnents/C_modalConfirm';

export default function MMedecinAgendaScreen() {

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

      // ================= PROFIL =================
      const profileRes = await getProfile();
      const profile = profileRes.data.data;

      console.log("👤 PROFIL MEDECIN =>", profile); // ✅ LOG 1

      setUser(profile);

      // ================= RDV =================
      const rdvRes = await getMyRendezvous(view);

      console.log("📡 RESPONSE RDV BRUT =>", rdvRes.data); // ✅ LOG 2 IMPORTANT

      const rdvs = rdvRes.data.data || [];

      console.log("📦 LIST RDV PARSE =>", rdvs); // ✅ LOG 3

      // ================= GROUPING =================
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

      console.log("📅 SECTIONS FINAL =>", sectionsData); // ✅ LOG 4

      setSections(sectionsData);

    } catch (err) {
      console.error('❌ ERREUR AGENDA MEDECIN =>', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= ITEM =================
  const renderItem = ({ item }) => {

    const isMedecin = user?.role === 'medecin';

    const name = isMedecin
      ? `${item.patient_nom || ''} ${item.patient_prenom || ''}`.trim()
      : `${item.medecin_nom || ''} ${item.medecin_prenom || ''}`.trim();

    return (
      <TouchableOpacity
        onPress={() => {
          console.log("📌 RDV SELECTED =>", item); // ✅ LOG CLICK ITEM
          setSelectedItem(item);
          setModalVisible(true);
        }}
        style={styles.card}
      >

        <View style={styles.timeBox}>
          <Text style={styles.time}>
            {item.heure_rdv?.slice(0, 5)}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {item.motif} - {name}
          </Text>

          <Text style={{ fontSize: 12, color: '#666' }}>
            {item.statut}
          </Text>

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
      />

      <C_button
        title={view === 'agenda' ? 'Voir Historique' : 'Voir Agenda'}
        onPress={() => {
          const newView = view === 'agenda' ? 'historique' : 'agenda';
          console.log("🔁 SWITCH VIEW =>", newView); // ✅ LOG SWITCH
          setView(newView);
        }}
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

/* ================= STYLES ================= */
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

  dateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
    color: '#2c3e50',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  timeBox: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  time: {
    fontWeight: 'bold',
    color: '#2BB673',
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
  },

  historyBtn: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#2BB673',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  historyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});