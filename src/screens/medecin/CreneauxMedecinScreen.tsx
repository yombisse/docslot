import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';

import { createRendezvous } from '../../services/rdvService';
import { getCreneauxByMedecin } from '../../services/medecinService';

import CustomFlatList from '../../componnents/C_Flatlist';
import { formatDate, formateTime } from '../../utils/formateDate';
import { getEndTime } from '../../utils/getEndCreneau';
import { useToast } from '../../utils/ToastContext';

const MedecinCreneauxScreen = ({ route, navigation }: any) => {
  const { showToast } = useToast();
  const { medecin } = route.params;

  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 refresh à chaque focus
  useFocusEffect(
    useCallback(() => {
      fetchCreneaux();
    }, [])
  );

  const fetchCreneaux = async () => {
    try {
      setLoading(true);
      const res = await getCreneauxByMedecin(medecin.id_medecin);

      const now = Date.now();

      const filtered = res.data.data.filter((item) => {
        const date = item.date_creneau.split('T')[0];
        const datetimeStr = `${date}T${item.heure_creneau}`;
        const time = new Date(datetimeStr).getTime();

        return !isNaN(time) && time > now;
      });

      setCreneaux(filtered);
    } catch (err) {
      showToast('Impossible de charger les créneaux', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ CONFIRMATION MODERNE (ALERT)
  const confirmRdv = (creneau: any) => {
    Alert.alert(
      'Confirmer le rendez-vous',
      `Médecin : Dr ${medecin.nom} ${medecin.prenom}
Spécialité : ${medecin.specialite}

Date : ${formatDate(creneau.date_creneau)}
Heure : ${formateTime(creneau.heure_creneau)} - ${getEndTime(
        creneau.heure_creneau,
        creneau.duree_creneau
      )}

Voulez-vous confirmer ce rendez-vous ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              const result = await createRendezvous({
                id_creneau: Number(creneau.id_creneau),
                id_medecin: Number(creneau.id_medecin),
              });

              if (!result?.success) {
                showToast(
                  result?.message ||
                    result?.error ||
                    'Créneau déjà réservé',
                  'error'
                );
                return;
              }

              showToast('Rendez-vous pris avec succès', 'success');
              navigation.navigate('MesRendezvous');
            } catch (error: any) {
              showToast(
                error?.response?.data?.message ||
                  'Erreur lors de la réservation',
                'error'
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.cardContainer} elevation={2}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.date}>{formatDate(item.date_creneau)}</Text>
            <Text style={styles.time}>
              {formateTime(item.heure_creneau)} -{' '}
              {getEndTime(item.heure_creneau, item.duree_creneau)}
            </Text>
          </View>

          <C_button
            title="Prendre RDV"
            style={styles.buttonRdv}
            onPress={() => confirmRdv(item)}
          />
        </View>
      </Card.Content>
      <Divider />
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <C_header
        text={`Dr ${medecin.nom} ${medecin.prenom}`}
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.navigate('MesRendezvous')}
      />

      {loading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : (
        <CustomFlatList
          data={creneaux}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_creneau.toString()}
          title="Créneaux disponibles"
        />
      )}
    </View>
  );
};

export default MedecinCreneauxScreen;

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  buttonRdv:{
    justifyContent:'center',
    alignContent:'center',
    height:30,
    borderRadius:10,
    paddingHorizontal:10
  }
});