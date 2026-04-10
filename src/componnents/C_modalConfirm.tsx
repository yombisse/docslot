import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import C_button from './C_button';

export default function C_RdvDetailsModal({
  visible,
  onClose,
  rdv,
  role,
}) {
  if (!rdv) return null;

  const name =
    role === 'medecin'
      ? `${rdv.patient_nom || ''} ${rdv.patient_prenom || ''}`.trim()
      : `${rdv.medecin_nom || ''} ${rdv.medecin_prenom || ''}`.trim();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text style={styles.title}>Détails du rendez-vous</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Personne :</Text>
            <Text style={styles.value}>{name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Motif :</Text>
            <Text style={styles.value}>{rdv.motif}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date :</Text>
            <Text style={styles.value}>{rdv.date_rdv}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Heure :</Text>
            <Text style={styles.value}>
              {rdv.heure_rdv?.slice(0, 5)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Statut :</Text>
            <Text style={styles.value}>{rdv.statut}</Text>
          </View>

          <C_button
            title="Retour"
            onPress={onClose}
            style={styles.button}
            textstyle={{ color: '#fff', fontWeight: 'bold' }}
          />

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2BB673',
    textAlign: 'center',
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    color: '#2c3e50',
    marginTop: 3,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2BB673',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
});