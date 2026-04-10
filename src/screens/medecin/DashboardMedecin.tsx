import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import { getProfile } from '../../services/userService';
import { getMyRendezvous } from '../../services/rdvService';

export default function DashboardMedecin({ navigation }) {
  const [user, setUser] = useState({});
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const profile = await getProfile();
      setUser(profile.data.data);

      const rdvRes = await getMyRendezvous('agenda');
      const today = new Date().toISOString().split('T')[0];

      const todayRdv = rdvRes.data.data.filter(
        (r) => r.date_rdv?.startsWith(today)
      );

      setRdvs(todayRdv);
    } catch (e) {
      console.log('Erreur dashboard médecin', e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.time}>{item.heure_rdv?.slice(0, 5)}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.motif}>{item.motif}</Text>
        <Text style={styles.patient}>
          {item.patient_nom} {item.patient_prenom}
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
      <C_header
        icon="chevron-back"
        size={30}
        text="Dashboard Médecin"
        onclickIcon={() => navigation.goBack()}
      />
      <View style={styles.bodycontainer}>
      {/* Bienvenue */}
      <Text style={styles.welcome}>
        Bienvenue Dr {user.nom} {user.prenom}
      </Text>

     
      {/* RDV du jour */}
      <Text style={styles.sectionTitle}>Rendez-vous aujourd’hui</Text>

      {rdvs.length === 0 ? (
        <Text style={styles.empty}>Aucun rendez-vous aujourd’hui</Text>
      ) : (
        <FlatList
          data={rdvs}
          keyExtractor={(item) => item.id_rdv.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}

       {/* Boutons actions */}
      <View style={styles.actions}>
        <C_button
          title="Ajouter disponibilité"
          onPress={() => navigation.navigate('Disponnibilite', {screen:'AddDisponibilite'})}
          style={styles.btn}
        />

        <C_button
          title=" Voir mon agenda"
          onPress={() => navigation.navigate('MesRendezvous')}
          style={styles.btnOutline}
          textstyle={{ color: '#2BB673' }}
        />
      </View>

    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  bodycontainer:{
    padding:10,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 15,
    color: '#2c3e50',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  btn: {
    flex: 1,
    height:50,
    borderRadius:20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#2BB673',
    justifyContent:'center',
    alignItems:'center'
  },

  btnOutline: {
    flex: 1,
    height:50,
    borderRadius:20,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2BB673',
    justifyContent:'center',
    alignItems:'center'
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2c3e50',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },

  time: {
    fontWeight: 'bold',
    color: '#2BB673',
    marginRight: 12,
  },

  motif: {
    fontWeight: '600',
    fontSize: 14,
  },

  patient: {
    color: '#555',
    marginTop: 4,
  },
});