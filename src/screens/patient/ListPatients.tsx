
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomFlatList from '../../componnents/C_Flatlist';
import { deletePatient, getAllPatients } from '../../services/patientService';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import { Card, Divider } from 'react-native-paper';
import { useToast } from '../../utils/ToastContext';

const ListPatientScreen = ({ navigation, route }: any) => {
  const { showToast } = useToast();
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
          showToast('Aucun patient trouvé', 'info');
        }
      } catch (error) {
        console.log(error);
        showToast('Impossible de charger les patients', 'error');
      }
    };

    fetchPatients();
  }, []);


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
            
          </View>
        </View>
      </Card.Content>
      <Divider />
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <C_header
        text="Liste des Patients"
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