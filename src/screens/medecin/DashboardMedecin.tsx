import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import C_button from '../../componnents/C_button';
import ProfileMenu from '../auth/ProfileMenu';
import { getProfile } from '../../services/userService';
import { getMyRendezvous } from '../../services/rdvService';
import { getUnreadCount } from '../../services/notificationsService';
import { logout } from '../../services/authService';

export default function DashboardMedecin({ navigation }) {

  const [user, setUser] = useState({});
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);

      const profile = await getProfile();
      const userData = profile?.data?.data;
      setUser(userData);

      const rdvRes = await getMyRendezvous();

      const today = new Date().toISOString().split('T')[0];

      const todayRdv = (rdvRes?.data?.data || []).filter((r) => {
        const rdvDate = r.date_rdv?.toString().split('T')[0];
        return rdvDate === today;
      });

      setRdvs(todayRdv);

    } catch (e) {
      console.log('Erreur dashboard médecin', e);
    } finally {
      setLoading(false);
    }
  };

  const loadUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnread(res.data.total);
    } catch (e) {
      console.log('Erreur notif badge', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUnread();
      fetchData();
    }, [])
  );

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigation.replace('Login');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.time}>
        {item.heure_rdv?.slice(0, 5)}
      </Text>

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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Docslot</Text>

        <View style={styles.headerIcons}>

          <TouchableOpacity
            onPress={() => {
                navigation.navigate('Notification');
              }}
            style={{ position: 'relative' }}
          >
            <Ionicons name="notifications-outline" size={26} color="#fff" />

            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unread > 99 ? '99+' : unread}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <ProfileMenu
            navigation={navigation}
            icon="person-circle-outline"
            items={[
              {
                icon: "person-outline",
                label: "Mon profil",
                onPress: () => navigation.navigate('ProfileMedecin'),
              },
              {
                icon: "log-out",
                label: "Deconnexion",
                onPress: () =>
                  navigation.navigate('Auth', { screen: 'Login' }),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.bodycontainer}>

        <Text style={styles.welcome}>
          Bienvenue Dr {user.nom} {user.prenom}
        </Text>

        <Text style={styles.sectionTitle}>
          Rendez-vous aujourd’hui
        </Text>

        {rdvs.length === 0 ? (
          <Text style={styles.empty}>
            Aucun rendez-vous aujourd’hui
          </Text>
        ) : (
          <FlatList
            data={rdvs}
            keyExtractor={(item) => item.id_rdv.toString()}
            renderItem={renderItem}
          />
        )}

        <View style={styles.actions}>

          <C_button
            title="Ajouter disponibilité"
            onPress={() =>
              navigation.navigate('Disponnibilite', {
                screen: 'AddDisponibilite',
              })
            }
            style={styles.btn}
          />

          <C_button
            title="Voir agenda"
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

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#2BB673',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  bodycontainer: {
    padding: 10,
  },

  welcome: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
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
    marginRight: 10,
  },

  motif: {
    fontWeight: '600',
  },

  patient: {
    color: '#555',
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
  },

  btn: {
    flex: 1,
    marginRight: 8,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnOutline: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
  },
});