import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import C_header from '../../componnents/C_header';
import { getAdminStats } from '../../services/userService';

const DashboardAdmin = ({ navigation }) => {

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ================= FETCH =================
  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res?.data?.stats || {});
    } catch (error) {
      console.log("Erreur stats admin:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  // ================= STAT CARD =================
  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.card}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.value}>{value ?? 0}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  // ================= ACTION BUTTON =================
  const ActionButton = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <C_header
        text="Dashboard "
        icon="menu-outline"
        onclickIcon={() => navigation.openDrawer()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* STATS */}
        <Text style={styles.sectionTitle}>Statistiques</Text>

        <View style={styles.statsGrid}>

          <StatCard title="Utilisateurs" value={stats.total_users} icon="people" color="#3498db" />
          <StatCard title="Patients" value={stats.total_patients} icon="person" color="#2ecc71" />
          <StatCard title="Médecins" value={stats.total_medecins} icon="medkit" color="#9b59b6" />
          <StatCard title="RDV" value={stats.total_rdv} icon="calendar" color="#f39c12" />
          <StatCard title="Disponibles" value={stats.medecins_disponibles} icon="checkmark-circle" color="#1abc9c" />

        </View>

        {/* ACTIONS IMPORTANTES UNIQUEMENT */}
        <Text style={styles.sectionTitle}>Gestion</Text>

        <View style={styles.actions}>

          <ActionButton
            title="Utilisateurs"
            icon="people-outline"
            color="#3498db"
            onPress={() => navigation.navigate('Utilisateurs')}
          />

          <ActionButton
            title="Patients"
            icon="person-outline"
            color="#2ecc71"
            onPress={() => navigation.navigate('Patients')}
          />

          <ActionButton
            title="Médecins"
            icon="medkit-outline"
            color="#9b59b6"
            onPress={() => navigation.navigate('Medecins')}
          />

          <ActionButton
            title="Rendez-vous"
            icon="calendar-outline"
            color="#f39c12"
            onPress={() => navigation.navigate('AllRendezvous')}
          />

        </View>

      </ScrollView>
    </View>
  );
};

export default DashboardAdmin;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  content: {
    padding: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#2c3e50',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#2c3e50',
  },

  title: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 3,
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  actionBtn: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
    gap: 8,
  },

  actionText: {
    fontWeight: '600',
    color: '#2c3e50',
  },
});