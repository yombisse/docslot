// src/screens/MedecinListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomFlatList from '../../componnents/C_Flatlist';
import { getAllMedecins } from '../../services/medecinService';
import C_header from '../../componnents/C_header';
import C_link from '../../componnents/C_link';
import { Card, Divider, Icon } from 'react-native-paper';
import C_button from '../../componnents/C_button';

const ListMedecins = ({ navigation, route }) => {
  const [medecins, setMedecins] = useState([]);

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const response = await getAllMedecins();
        console.log('Liste medecins', response); // Debug
        if (response.data.success && response.data.data) {
          setMedecins(response.data.data);
        } else {
          setMedecins([]);
          Alert.alert('Info', 'Aucun médecin trouvé');
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Erreur', 'Impossible de charger les médecins');
      }
    };

    fetchMedecins();
  }, []);

  const renderItem = ({ item }: any) => (
    <Card style={styles.cardContainer} elevation={2}>
      <Card.Content>
        {/* Informations du médecin */}
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.nom}{item.prenom}</Text>
            <Text style={styles.speciality}>{item.specialite}</Text>
          </View>

          {/* Boutons alignés sur la même ligne */}
          <View style={styles.buttonsRow}>
            <C_button
              icon="eye-outline"
              iconstyle={styles.icon}
              size={24}
              color="#fff"
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate('MedecinDetail', {
                  medecinId: item.id_medecin,
                  medecinData: item,
                })
              }
            />
            <C_button
              icon="pencil-outline"
              size={24}
              color="#fff"
              onPress={() =>
                navigation.navigate('AddMedecin', {
                  medecinId: item.id_medecin,
                  medecinData: item,
                })
              }
              style={[styles.actionButton, { backgroundColor: '#4e9bde' }]}
            />
            <C_button
              icon="trash-outline"
              size={24}
              color="#fff"
              onPress={() =>
                Alert.alert(
                  'Confirmer',
                  'Voulez-vous vraiment supprimer ce médecin ?',
                  [
                    { text: 'Annuler', style: 'cancel' },
                    {
                      text: 'Supprimer',
                      style: 'destructive',
                      onPress: () => console.log('Supprimer', item.id_medecin),
                    },
                  ]
                )
              }
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
          icon="chevron-back"
          size={30}
          onclickIcon={() => navigation.goBack()}
        />
        {medecins.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Aucun médecin disponible
          </Text>
        ) : (
          <CustomFlatList
            data={medecins}
            renderItem={renderItem}
            keyExtractor={(item) => item.id_medecin.toString()}
            title="Liste des Médecins"
          />
        )}
        
        <C_button
        title="+"
        onPress={() => navigation.navigate("AddMedecin")}
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
    paddingVertical:10,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  speciality: {
    fontSize: 14,
    color: '#2BB673',
    marginTop: 3,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 5, // espacement entre les boutons (RN >=0.71)
    alignItems: 'center',
  },
 
  actionButton: {
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  icon:{
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
    elevation: 5, // ombre Android
    shadowColor: '#000', // ombre iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ListMedecins;