import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import { getAdminStats } from '../../services/userService';

const DashboardAdmin = ({ navigation }) => {

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data.stats); 
      console.log("Stats:",stats)// ✔ basé sur ton controller
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

  const StatCard = ({ title, value, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <C_header text="Dashboard Admin" icon="menu-outline" onclickIcon={()=>navigation.openDrawer()} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* 🔥 STATS */}
        <View style={styles.statsGrid}>

          <StatCard
            title="Utilisateurs"
            value={stats.total_users}
            color="#3498db"
          />

          <StatCard
            title="Patients"
            value={stats.total_patients}
            color="#2ecc71"
          />

          <StatCard
            title="Médecins"
            value={stats.total_medecins}
            color="#9b59b6"
          />

          <StatCard
            title="RDV Total"
            value={stats.total_rdv}
            color="#f39c12"
          />

          <StatCard
            title="Médecins disponibles"
            value={stats.medecins_disponibles}
            color="#1abc9c"
          />

        </View>

        {/* 🔥 ACTIONS */}
        <C_button
          title="Ajouter un médecin"
          onPress={() => navigation.navigate('AddMedecin')}
          style={styles.button}
        />

        <C_button
          title="Voir les rendez-vous"
          onPress={() => navigation.navigate('RendezvousList')}
          style={[styles.button, { backgroundColor: '#3498db' }]}
        />

      </ScrollView>
    </View>
  );
};

export default DashboardAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8'
  },
  content: {
    padding: 15
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    elevation: 3
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  title: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 5
  },
  button: {
    marginTop: 15,
    backgroundColor: '#2BB673',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  }
});