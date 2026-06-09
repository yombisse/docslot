import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
  FlatList,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import ProfileMenu from '../../screens/auth/ProfileMenu';

import { getProfile } from '../../services/userService';
import { getMyRendezvous } from '../../services/rdvService';
import { getUnreadCount } from '../../services/notificationsService';
import { formatDate } from '../../utils/formateDate';
import { logout } from '../../services/authService';

const DashboardPatient = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState({});
  const [rdv, setRdv] = useState([]);
  const [unread, setUnread] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);

      const user = await getProfile();
      const rendezvous = await getMyRendezvous();

      const rdvData =
        rendezvous?.data?.data ||
        rendezvous?.data ||
        [];

      setPatient(user?.data?.data || {});

      const sorted = rdvData
        .filter(r => r.date_rdv && r.heure_rdv)
        .sort((a, b) => {
          const aTime = new Date(`${a.date_rdv.split('T')[0]}T${a.heure_rdv}`).getTime();
          const bTime = new Date(`${b.date_rdv.split('T')[0]}T${b.heure_rdv}`).getTime();
          return aTime - bTime;
        })
        .slice(0, 3);

      setRdv(sorted);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnread(res?.data?.total || 0);
    } catch (e) {
      console.log(e);
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

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth', params: { screen: 'Login' } }],
              });
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const renderRdvItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="medical-outline" size={20} color="#2BB673" />
        <Text style={styles.bold}>
          Dr {item.medecin_nom} {item.medecin_prenom}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={18} />
        <Text>{formatDate(item.date_rdv)}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="time-outline" size={18} />
        <Text>{item.heure_rdv?.slice(0, 5)}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="checkmark-done-outline" size={18} color="#2BB673" />
        <Text>{item.statut}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <C_header text="Docslot" style={styles.header}>
        <View style={styles.icons}>

          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
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
                icon: 'person-outline',
                label: 'Mon profil',
                onPress: () => navigation.navigate('ProfilPatient'),
              },
              {
                icon: 'log-out',
                label: 'Deconnexion',
                onPress: handleLogout,
              },
            ]}
          />

        </View>
      </C_header>

      <View style={styles.body}>

        <View style={styles.welcome}>
          <Ionicons name="hand-left-outline" size={22} color="#2BB673" />
          <Text style={styles.welcomeText}>
            Bienvenue, {patient.nom}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Derniers rendez-vous
        </Text>

        <FlatList
          data={rdv}
          keyExtractor={(item) => item.id_rdv.toString()}
          renderItem={renderRdvItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Aucun rendez-vous confirmé
            </Text>
          }
        />

        <C_button
          title="Prendre rendez-vous"
          onPress={() =>
            navigation.navigate('Rendezvous', { screen: 'AddRendezvous' })
          }
          style={styles.button}
        />

      </View>
    </View>
  );
};

export default DashboardPatient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  header: {
    backgroundColor: '#2BB673',
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
  },
  body: {
    flex: 1,
  },
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    gap: 8,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    margin: 20,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});