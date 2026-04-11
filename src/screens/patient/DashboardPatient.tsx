import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import C_header from '../../componnents/C_header';
import C_text from '../../componnents/C_text';
import C_button from '../../componnents/C_button';
import CustomFlatList from '../../componnents/C_Flatlist';

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

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const user = await getProfile();
      const rendezvous = await getMyRendezvous();

      if (user.data.success) {
        setPatient(user.data.data);
      }

      if (rendezvous.data.success) {
        const sorted = rendezvous.data.data
          .sort(
            (a, b) =>
              new Date(`${a.date_rdv} ${a.heure_rdv}`).getTime() -
              new Date(`${b.date_rdv} ${b.heure_rdv}`).getTime()
          )
          .slice(0, 2);

        setRdv(sorted);
      }

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadUnread = async () => {
      try {
        const res = await getUnreadCount();
        console.log("UNREAD RESPONSE =>", res.data.total);
        setUnread(res.data.total);
        console.log("UNREAD RESPONSE =>", unread);
      } catch (e) {
        console.log('Erreur notif badge', e);
      }
    };
      const handleLogout = async () => {
        const result = await logout();
        if (result) {
          navigation.replace('Login'); // ou AuthScreen
        }
      };
  
    // ===================== INIT =====================
    useEffect(() => {
      fetchData();
    }, []);
  
    // ===================== REFRESH À CHAQUE NAVIGATION =====================
    useFocusEffect(
      useCallback(() => {
        loadUnread();
        fetchData();
      }, [])
    );
  
  // ================= RDV CARD =================
  const renderRdvItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="medical-outline" size={20} color="#2BB673" />
        <C_text
          text={`Dr. ${item.medecin_nom} ${item.medecin_prenom}`}
          style={styles.bold}
        />
      </View>

      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={18} />
        <C_text text={formatDate(item.date_rdv)} />
      </View>

      <View style={styles.row}>
        <Ionicons name="time-outline" size={18} />
        <C_text text={item.heure_rdv.slice(0, 5)} />
      </View>

      <View style={styles.row}>
        <Ionicons name="checkmark-done-outline" size={18} color="#2BB673" />
        <C_text text={`Statut : ${item.statut}`} />
      </View>
    </View>
  );

  if (loading || !patient) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <C_header text="Docslot" color="#fff" />

        <View style={styles.icons}>

          {/* NOTIFICATION ICON + BADGE */}
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

          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={32} color="#fff" />
          </TouchableOpacity>

        </View>
      </View>

      {/* BIENVENUE */}
      <View style={styles.welcome}>
        <Ionicons name="hand-left-outline" size={22} color="#2BB673" />
        <C_text text={`Bienvenue, ${patient.nom}`} style={styles.welcomeText} />
      </View>

      {/* RDV LIST */}
      <CustomFlatList
        title="Vos prochains rendez-vous"
        data={rdv}
        renderItem={renderRdvItem}
        keyExtractor={(item) => item.id_rdv.toString()}
      />

      <C_button
        title="Prendre rendez-vous"
        onPress={() =>
          navigation.navigate('Rendezvous', { screen: 'AddRendezvous' })
        }
        style={styles.button}
      />

    </View>
  );
};

export default DashboardPatient;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2BB673',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },

  icons: {
    flexDirection: 'row',
    gap: 12,
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

  card: {
    backgroundColor: '#f2f2f2',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },

  bold: {
    fontWeight: 'bold',
  },

  button: {
    margin: 20,
    height:50,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center'
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

});