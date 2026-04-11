
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomFlatList from '../../componnents/C_Flatlist';
import { deletePatient, getAllPatients } from '../../services/patientService';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import { Card, Divider } from 'react-native-paper';

const ListPatientScreen = ({ navigation, route }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        console.log('Liste patients', response); // Debug
        if (response.data.success && response.data.data) {
          setPatients(response.data.data);
        } else {
          setPatients([]);
          Alert.alert('Info', 'Aucun patient trouvé');
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Erreur', 'Impossible de charger les patients');
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = (id_patient: number) => {
    Alert.alert(
      'Confirmer',
      'Voulez-vous vraiment supprimer ce patient ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deletePatient(id_patient);
            console.log('Supprimer patient', id_patient);
            setPatients(patients.filter(p => p.id_patient !== id_patient));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.cardContainer} elevation={2}>
      <Card.Content>
        {/* Informations du patient */}
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.nom} {item.prenom}</Text>
            <Text style={styles.details}>📞 {item.telephone || 'Non renseigné'}</Text>
            {item.email && <Text style={styles.email}>{item.email}</Text>}
          </View>

          {/* Boutons d'action alignés */}
          <View style={styles.buttonsRow}>
            <C_button
              icon="eye-outline"
              iconstyle={styles.icon}
              size={24}
              color="#fff"
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate('Detail', {
                data: item,
                type: 'patient'
                })
              }
            />
            <C_button
              icon="pencil-outline"
              size={24}
              color="#fff"
              onPress={() =>
                navigation.navigate('AddPatient', {
                  patientId: item.id_patient,
                  patientData: item,
                })
              }
              style={[styles.actionButton, { backgroundColor: '#4e9bde' }]}
            />
            <C_button
              icon="trash-outline"
              size={24}
              color="#fff"
              onPress={() => handleDelete(item.id_patient)}
              style={[styles.actionButton, { backgroundColor: '#f44336' }]}
            />
          </View>
        </View>
      </Card.Content>
      <Divider />
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <C_header
        title="Liste des Patients"
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.goBack()}
      />
      
      {patients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun patient disponible</Text>
        </View>
      ) : (
        <CustomFlatList
          data={patients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_patient?.toString()}
          title="Liste des Patients"
        />
      )}
      
      <C_button
        title="+"
        onPress={() => navigation.navigate("AddPatient")}
        style={styles.addButtonFloating}
        textstyle={{ fontSize: 30, color: '#fff', fontWeight: 'bold' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  email: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontStyle: 'italic',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  icon: {
    marginRight: 0,
    alignSelf: 'center',
  },
  addButtonFloating: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default ListPatientScreen;