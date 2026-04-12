import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { getProfile } from '../../services/userService';
import C_button from '../../componnents/C_button';
import C_RdvDetailsModal from '../../componnents/C_modalConfirm';
import { getAllRendezvous, getMyRendezvous } from '../../services/rdvService';
import C_header from '../../componnents/C_header';
import { formateTime, formatTime } from '../../utils/formateDate';

export default function PatientAgendaScreen({navigation}) {
  const [sections, setSections] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('agenda');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    try {
      setLoading(true);

      
      const profileResult = await getProfile();
      const profileData = profileResult?.data?.data;

      if (!profileResult?.data?.success || !profileData) {
        setSections([]);
        return;
      }

      setUser(profileData);

  
      let rdvResponse;

      if (profileData.role === 'administrateur') {
        rdvResponse = await getAllRendezvous();
      } else {
        
        rdvResponse = await getMyRendezvous()
      }

      const rdvs = rdvResponse?.data?.data;

      if (!Array.isArray(rdvs)) {
        setSections([]);
        return;
      }

   const grouped = {};

  rdvs.forEach((rdv) => {
    const rawDate = rdv.date_rdv; 

    const dateKey = new Date(rawDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        rawDate,
        data: [],
      };
    }

    grouped[dateKey].data.push(rdv);
  });

  const sectionsData = Object.entries(grouped)
    .sort((a, b) => new Date(a[1].rawDate) - new Date(b[1].rawDate))
    .map(([title, value]) => ({
      title,
      data: value.data,
    }));
      setSections(sectionsData);
    } catch (err) {
      console.error('fetch error:', err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  
  const renderItem = ({ item }) => {
    const isAdmin = user?.role === 'administrateur';
    const isMedecin = user?.role === 'medecin';

    const name =
      isAdmin
        ? `${item?.patient_nom ?? ''} ${item?.patient_prenom ?? ''} → ${item?.medecin_nom ?? ''} ${item?.medecin_prenom ?? ''}`.trim()
        : isMedecin
        ? `${item?.patient_nom ?? ''} ${item?.patient_prenom ?? ''}`.trim()
        : `${item?.medecin_nom ?? ''} ${item?.medecin_prenom ?? ''}`.trim();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        {/* TIME */}
        <View style={styles.timeBox}>
          <Text style={styles.time}>
            {formateTime(item.heure_rdv)}
          </Text>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>
            {item?.motif ?? 'Sans motif'} - {name}
          </Text>

          <Text style={styles.status}>
            {(item?.statut ?? 'en_attente').toUpperCase()}
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
        keyExtractor={(item) => item.id_rdv?.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.dateTitle}>{section.title}</Text>
        )}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* SWITCH VIEW (sauf admin) */}
      {user?.role !== 'administrateur' && (
        <C_button
          title={view === 'agenda' ? 'Voir Historique' : 'Voir Agenda'}
          onPress={() =>
            setView(view === 'agenda' ? 'historique' : 'agenda')
          }
          style={styles.btn}
          textstyle={{ color: '#fff' }}
        />
      )}

      {/* MODAL */}
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
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginVertical: 12,
    marginHorizontal: 10,
    color: '#2BB673',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  timeBox: {
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    marginRight: 12,
  },

  time: {
    fontWeight: '800',
    fontSize: 13,
    color: '#2BB673',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
    lineHeight: 18,
  },

  status: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    backgroundColor: '#2BB673',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
  },

  btn: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: '#2BB673',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});