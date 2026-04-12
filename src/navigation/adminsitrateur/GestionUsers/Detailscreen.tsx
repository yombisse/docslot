import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import C_header from '../../../componnents/C_header';
import { Card, Divider } from 'react-native-paper';

const DetailsScreen = ({ route, navigation }) => {
  const { data, type } = route.params;

  const renderField = (label, value) => {
    if (!value) return null;

    return (
      <>
        <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        <Divider style={styles.divider} />
      </>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <C_header
        icon="chevron-back"
        size={26}
        onclickIcon={() => navigation.goBack()}
        text="Détails du profil"
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card} elevation={3}>
          <Card.Content>

            {/* HEADER IDENTITÉ */}
            <View style={styles.headerBox}>
              <Text style={styles.title}>
                {data.nom} {data.prenom}
              </Text>
              <Text style={styles.subtitle}>{type.toUpperCase()}</Text>
            </View>

            <Divider style={styles.sectionDivider} />

            {/* INFOS COMMUNES */}
            {renderField('Email', data.email)}
            {renderField('Téléphone', data.telephone)}
            {renderField('Rôle', data.role)}

            {/* PATIENT */}
            {type === 'patient' && (
              <>
                {renderField('Adresse', data.adresse)}
                {renderField('Date de naissance', data.date_naissance)}
              </>
            )}

            {/* MEDECIN */}
            {type === 'medecin' && (
              <>
                {renderField('Spécialité', data.specialite)}
                {renderField(
                  'Durée créneau',
                  data.duree_creneau + ' min'
                )}
              </>
            )}

            {/* USER */}
            {type === 'user' && (
              <>
                {renderField('Statut', data.status)}
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2BB673',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#888',
    letterSpacing: 1,
  },
  sectionDivider: {
    marginVertical: 12,
  },
  row: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 6,
  },
});