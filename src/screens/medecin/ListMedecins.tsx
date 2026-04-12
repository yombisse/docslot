import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Divider } from 'react-native-paper';

import CustomFlatList from '../../componnents/C_Flatlist';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';

import {
  getAllMedecins,
  validerMedecin,
  suspendreMedecin,
  reactiverMedecin,
} from '../../services/medecinService';

const ListMedecins = ({ navigation }) => {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedecins = async () => {
    try {
      setLoading(true);
      const response = await getAllMedecins();

      if (response.data.success && response.data.data) {
        setMedecins(response.data.data);
      } else {
        setMedecins([]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les médecins');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedecins();
    }, [])
  );

  const handleAction = (action: Function, id: number, message: string) => {
    Alert.alert('Confirmation', message, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: async () => {
          await action(id);
          fetchMedecins();
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.cardContainer} elevation={2}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {item.nom} {item.prenom}
            </Text>
            <Text style={styles.speciality}>{item.specialite}</Text>
            <Text style={styles.status}>
              Statut : {item.statut_medecin}
            </Text>
          </View>

          <View style={styles.buttonsRow}>
            {/* Voir profil */}
            <C_button
              icon="eye-outline"
              size={24}
              color="#fff"
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate('Detail', {
                  data: item,
                  type: 'medecin',
                })
              }
            />

            {/* Valider */}
            {item.statut_medecin === 'en_attente' && (
              <C_button
                icon="checkmark-outline"
                size={24}
                color="#fff"
                style={styles.validateButton}
                onPress={() =>
                  handleAction(
                    validerMedecin,
                    item.id_medecin,
                    'Valider ce médecin ?'
                  )
                }
              />
            )}

            {/* Suspendre */}
            {item.statut_medecin === 'valide' && (
              <C_button
                icon="close-outline"
                size={24}
                color="#fff"
                style={styles.suspendButton}
                onPress={() =>
                  handleAction(
                    suspendreMedecin,
                    item.id_medecin,
                    'Suspendre ce médecin ?'
                  )
                }
              />
            )}

            {/* Réactiver */}
            {item.statut_medecin === 'suspendu' && (
              <C_button
                icon="refresh-outline"
                size={24}
                color="#fff"
                style={styles.reactivateButton}
                onPress={() =>
                  handleAction(
                    reactiverMedecin,
                    item.id_medecin,
                    'Réactiver ce médecin ?'
                  )
                }
              />
            )}
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
        text="Médecins"
        size={30}
        onclickIcon={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2BB673" />
          <Text style={{ marginTop: 10 }}>Chargement...</Text>
        </View>
      ) : medecins.length === 0 ? (
        <Text style={styles.emptyText}>Aucun médecin disponible</Text>
      ) : (
        <CustomFlatList
          data={medecins}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_medecin.toString()}
          title="Supervision des médecins"
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
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  status: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  viewButton: {
    backgroundColor: '#2BB673',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  validateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  suspendButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  reactivateButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
export default ListMedecins