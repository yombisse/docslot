// src/screens/MedecinListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomFlatList from '../../componnents/C_Flatlist';
import { getAllMedecinsDisponibles } from '../../services/medecinService';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import { Card, Divider } from 'react-native-paper';
import { createRendezvous } from '../../services/rdvService';
import { useToast } from '../../utils/ToastContext';

const ListMedecinsDisponibles = ({ navigation }: any) => {
  const { showToast } = useToast();
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        setLoading(true);
        const response = await getAllMedecinsDisponibles();
        console.log('Médecins disponibles', response.data); // debug
        if (response.data.success && response.data.data) {
          setMedecins(response.data.data);
        } else {
          setMedecins([]);
          showToast('Aucun médecin disponible', 'info');
        }
      } catch (error) {
        console.log(error.message ); // debug détaillé
        showToast('Impossible de charger les médecins', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMedecins();
  }, []);


  const renderItem = ({ item }) => (
    <Card style={styles.cardContainer} elevation={2}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.nom} {item.prenom}</Text>
            <Text style={styles.speciality}>{item.specialite}</Text>
            <Text style={styles.dispo}>
              {item.nb_creneaux_disponibles } créneaux disponibles
            </Text>
          </View>

          <C_button
          title="Voir les créneaux"
          onPress={() =>
            navigation.navigate('MedecinCreneaux', { medecin: item })
          }
          style={styles.rdvButton}
        />
        </View>
      </Card.Content>
      <Divider />
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <C_header
      text='Prendre un rendez-vous'
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.navigate('MesRendezvous')}
      />

      {loading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : medecins.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Aucun médecin disponible
        </Text>
      ) : (
        <CustomFlatList
          data={medecins}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_medecin.toString()}
          title="Médecins disponibles"
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
  dispo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rdvButton: {
    backgroundColor: '#2BB673',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
});

export default ListMedecinsDisponibles;