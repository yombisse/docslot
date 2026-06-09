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
import { formateTime } from '../../utils/formateDate';

export default function PatientAgendaScreen({ navigation }) {
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

      let rdvResponse =
        profileData.role === 'administrateur'
          ? await getAllRendezvous()
          : await getMyRendezvous();

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
          data: value.data.sort(
            (a, b) =>
              new Date(`1970-01-01T${a.heure_rdv}`) -
              new Date(`1970-01-01T${b.heure_rdv}`)
          ),
        }));

      setSections(sectionsData);
    } catch (err) {
      console.log(err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirme':
        return styles.statusConfirmed;
      case 'en_attente':
        return styles.statusPending;
      case 'annule':
        return styles.statusCanceled;
      default:
        return styles.statusPending;
    }
  };

  const renderItem = ({ item }) => {
    const name =
      user?.role === 'administrateur'
        ? `${item.patient_nom} ${item.patient_prenom} → ${item.medecin_nom} ${item.medecin_prenom}`
        : `${item.medecin_nom} ${item.medecin_prenom}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
        activeOpacity={0.85}
      >
        <View style={styles.timeBox}>
          <Text style={styles.time}>{formateTime(item.heure_rdv)}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.motif || 'Consultation'} - {name}
          </Text>

          

          <View style={[styles.status, getStatusStyle(item.statut)]}>
            <Text style={styles.statusText}>
              {item.statut.toUpperCase()}
            </Text>
          </View>
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
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {user?.role !== 'administrateur' && (
        <C_button
          title={view === 'agenda' ? 'Voir historique' : 'Voir agenda'}
          onPress={() =>
            setView(view === 'agenda' ? 'historique' : 'agenda')
          }
          style={styles.btn}
        />
      )}

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
    backgroundColor: '#F6F8FB',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 12,
    marginHorizontal: 15,
    color: '#2BB673',
    textTransform: 'capitalize',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },

  timeBox: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
  },

  time: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2BB673',
  },

  content: {
    flex: 1,
    paddingLeft: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
  },

  subtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 3,
  },

  status: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },

  statusConfirmed: {
    backgroundColor: '#2BB673',
  },

  statusPending: {
    backgroundColor: '#F39C12',
  },

  statusCanceled: {
    backgroundColor: '#E74C3C',
  },

  btn: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: '#2BB673',
    padding: 14,
    borderRadius: 12,
  },
});