// src/screens/MedecinListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CustomFlatList from '../../componnents/C_Flatlist';
import {getAllMedecinsDisponibles} from '../../services/medecinService';
import C_header from '../../componnents/C_header';


const ListMedecinsDisponnibles = ({navigation})=>{
  const [medecins, setMedecins] = useState([]);

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const response = await getAllMedecinsDisponibles();
        setMedecins(response.data);
      } catch (error) {
        console.log(error);
        Alert.alert('Erreur', 'Impossible de charger les médecins');
      }
    };
    fetchMedecins();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.nom} {item.prenom}</Text>
        <Text style={styles.speciality}>{item.specialite}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigation.navigate('MedecinDetail', { medecinId: item.id })}
        >
          <Text style={styles.buttonText}>Voir détails</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rdvButton}
          onPress={() => navigation.navigate('RendezVousForm', { medecinId: item.id })}
        >
          <Text style={styles.buttonText}>Prendre rendez-vous</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
    <C_header icon='chevron-back' size={30} onclickIcon={()=>navigation.goBack()}/>
      <CustomFlatList
        data={medecins}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        title="Liste des Médecins"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  speciality: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  detailButton: {
    backgroundColor: '#4e9bde',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  rdvButton: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default ListMedecinsDisponnibles;