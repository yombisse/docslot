// src/screens/GenericDetailsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import C_header from '../../../componnents/C_header';
import { Card } from 'react-native-paper';

const DetailsScreen = ({ route, navigation }) => {
  const { data, type } = route.params;

  const renderField = (label, value) => {
    if (!value) return null;

    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label} :</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <C_header
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.goBack()}
        text="Détails"
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>

            {/* HEADER */}
            <Text style={styles.title}>
              {data.nom} {data.prenom}
            </Text>

            {/* COMMON FIELDS */}
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
                {renderField('Durée créneau', data.duree_creneau + ' min')}
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
    padding: 15,
  },
  card: {
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '600',
    width: 120,
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#555',
  },
});