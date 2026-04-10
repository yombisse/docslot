import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import C_header from '../../componnents/C_header';
import C_text from '../../componnents/C_text';
import C_button from '../../componnents/C_button';
import CustomFlatList from '../../componnents/C_Flatlist';
import ModalGeneric from '../../componnents/C_Modal';

import { getProfile } from '../../services/userService';
import { getMyRendezvous } from '../../services/rdvService';
import { formatDate } from '../../utils/formateDate';

const DashboardPatient = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState({});
  const [rdv, setRdv] = useState([]);

  const [profileModal, setProfileModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await getProfile();
      const rendezvous = await getMyRendezvous();

      if (user.data.success) setPatient(user.data.data);
      console.log("User:",patient)

      if (rendezvous.data.success) {
        console.log("RDV:",rendezvous)
        const sorted = rendezvous.data.data
          .sort((a: any, b: any) =>
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

  useEffect(() => {
    fetchData();
  }, []);

  // ================= RENDER RDV CARD =================
  const renderRdvItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="medical-outline" size={20} color="#2BB673" />
        <C_text text={`Dr. ${item.medecin_nom} ${item.medecin_prenom}`} style={styles.bold} />
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
          <TouchableOpacity onPress={() => setNotifModal(true)}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setProfileModal(true)}>
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
        onPress={() => navigation.navigate('Rendezvous',{screen:'AddRendezvous'})}
        style={styles.button}
      />

      {/* ================= MODAL PROFILE ================= */}
      <ModalGeneric
        visible={profileModal}
        title="Mon profil"
        details={[
          { label: 'Nom', value: `${patient.nom} ${patient.prenom}` },
          { label: 'Email', value: patient.email },
          { label: 'Téléphone', value: patient.telephone || '' },
        ]}
        confirmText="Déconnexion"
        cancelText="Fermer"
        onClose={() => setProfileModal(false)}
        onConfirm={() => console.log('logout')}
      />

      {/* ================= MODAL NOTIFICATION ================= */}
      <ModalGeneric
        visible={notifModal}
        title="Notifications"
        details={
          rdv.length === 0
            ? [{ label: '', value: 'Aucune notification' }]
            : rdv.map((r) => ({
                label: r.date_rdv,
                value: `RDV avec Dr. ${r.medecin_nom} à ${r.heure_rdv.slice(0, 5)}`,
              }))
        }
        confirmText="Fermer"
        cancelText=""
        onClose={() => setNotifModal(false)}
        onConfirm={() => setNotifModal(false)}
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
});