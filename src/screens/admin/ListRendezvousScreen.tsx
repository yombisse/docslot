import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import C_header from '../../componnents/C_header';
import { getAllRendezvous } from '../../services/rdvService';

export default function RendezvousListScreen({ navigation }) {

  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getAllRendezvous();

      if (res?.success) {
        setRdvs(res?.data?.data || res?.data || []);
      } else {
        setRdvs([]);
      }

    } catch (error) {
      console.log('Erreur RDV:', error);
      setRdvs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };


  const renderItem = ({ item }) => (
    <View style={styles.card}>

     
      <View style={styles.timeBox}>
        <Ionicons name="time-outline" size={18} color="#2BB673" />
        <Text style={styles.time}>
          {item.heure_rdv?.slice(0, 5)}
        </Text>
      </View>


      <View style={styles.content}>

        <Text style={styles.text}>
          👤 Patient: {item.patient_nom} {item.patient_prenom}
        </Text>

        <Text style={styles.text}>
          🩺 Médecin: {item.medecin_nom} {item.medecin_prenom}
        </Text>

        <Text style={styles.status}>
          {(item.statut || 'en_attente').toUpperCase()}
        </Text>

      </View>

    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER COMPONENT */}
      <C_header
        text="Tous les rendez-vous"
        icon="chevron-back-outline"
        onclickIcon={() => navigation.goBack()}
      />

      <FlatList
        data={rdvs}
        keyExtractor={(item) => item.id_rdv?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun rendez-vous trouvé</Text>
        }
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

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
  },

  timeBox: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    marginRight: 10,
  },

  time: {
    marginTop: 5,
    fontWeight: '700',
    color: '#2BB673',
  },

  content: {
    flex: 1,
  },

  motif: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
    color: '#2c3e50',
  },

  text: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },

  status: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#2BB673',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },

});