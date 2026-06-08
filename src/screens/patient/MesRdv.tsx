import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import PatientAgendaScreen from './Rdv';
import MesRendezVous from '../medecin/MesRendezvous';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';

export default function RendezVousTabs({ navigation }) {
  const [tab, setTab] = useState(1);

  return (
    <View style={styles.container}>

      <C_header
        text="Mes rendez-vous"
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.navigate('DashboardPatient')}
      />

      {/* ================= TABS ================= */}
      <View style={styles.tabs}>

        <C_button
          title="Agenda"
          onPress={() => setTab(1)}
          style={[styles.btn, tab === 1 && styles.activeBtn]}
          textstyle={styles.text}
        />

        <C_button
          title="Calendrier"
          onPress={() => setTab(2)}
          style={[styles.btn, tab === 2 && styles.activeBtn]}
          textstyle={styles.text}
        />

      </View>

      {/* ================= CONTENT ================= */}
      <View style={styles.content}>
        {tab === 1 ? (
          <PatientAgendaScreen />
        ) : (
          <MesRendezVous navigation={navigation} />
        )}
      </View>

    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  tabs: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    justifyContent:'center',
    alignItems:'center'
  },

  activeBtn: {
    backgroundColor: '#2BB673',
  },

  text: {
    fontWeight: 'bold',
    color: '#000',
  },

  content: {
    flex: 1,
  },
});