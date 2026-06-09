// src/screens/MedecinListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomFlatList from '../../componnents/C_Flatlist';
import { getAllMedecinsDisponibles } from '../../services/medecinService';
import C_header from '../../componnents/C_header';
import C_button from '../../componnents/C_button';
import { Card } from 'react-native-paper';
import { useToast } from '../../utils/ToastContext';

const ListMedecinsDisponibles = ({ navigation }: any) => {
  const { showToast } = useToast();
  const [medecins, setMedecins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        setLoading(true);

        const response = await getAllMedecinsDisponibles();

        if (response.data.success && response.data.data) {
          
          const filtered = response.data.data.filter(
            (m: any) => (m.nb_creneaux_disponibles || 0) > 0
          );

          setMedecins(filtered);

          if (filtered.length === 0) {
            showToast('Aucun médecin disponible', 'info');
          }
        } else {
          setMedecins([]);
          showToast('Aucun médecin disponible', 'info');
        }
      } catch (error: any) {
        console.log(error?.message);
        showToast('Impossible de charger les médecins', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMedecins();
  }, []);

  
  const renderItem = ({ item }: any) => {
    const hasImage = item.profile_url && item.profile_url.length > 0;

    const initials =
      (item.nom?.charAt(0) || '') + (item.prenom?.charAt(0) || '');

    return (
      <Card style={styles.card} elevation={4}>
        <View style={styles.row}>

          {/* AVATAR */}
          {hasImage ? (
            <Image
              source={{ uri: item.profile_url }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}

          {/* INFOS */}
          <View style={styles.info}>
            <Text style={styles.name}>
              Dr {item.nom} {item.prenom}
            </Text>

            <Text style={styles.speciality}>
              {item.specialite}
            </Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.nb_creneaux_disponibles} créneaux disponibles
              </Text>
            </View>
          </View>
        </View>

        {/* ACTION */}
        <C_button
          title="Voir les créneaux"
          onPress={() =>
            navigation.navigate('MedecinCreneaux', { medecin: item })
          }
          style={styles.button}
        />
      </Card>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <C_header
        text="Prendre un rendez-vous"
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.navigate('MesRendezvous')}
      />

      {loading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : medecins.length === 0 ? (
        <Text style={styles.emptyText}>
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

export default ListMedecinsDisponibles;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 18,
    backgroundColor: '#fff',

    // shadow Android
    elevation: 6,

    // shadow iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  // ROW PRINCIPALE (IMPORTANT UX)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },

  // AVATAR IMAGE
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 12,
  },

  // FALLBACK AVATAR
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2BB673',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  // INFO BLOCK
  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  speciality: {
    fontSize: 13,
    color: '#2BB673',
    marginTop: 3,
    fontWeight: '500',
  },

  // BADGE DISPONIBILITÉ
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#EAF7F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    color: '#1B7A4A',
    fontWeight: '600',
  },

  // BUTTON
  button: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // STATES
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#6B7280',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#6B7280',
  },
});