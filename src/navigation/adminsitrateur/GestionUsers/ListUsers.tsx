// src/screens/ListUserScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomFlatList from '../../../componnents/C_Flatlist';
import { getAllUsers, deleteUser } from '../../../services/userService';
import C_header from '../../../componnents/C_header';
import C_button from '../../../componnents/C_button';
import { Card, Divider } from 'react-native-paper';

const ListUserScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();

      if (response.data.success && response.data.data) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // refresh à chaque retour écran
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleDelete = (id_user: number) => {
    Alert.alert(
      'Confirmer',
      'Voulez-vous vraiment supprimer cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteUser(id_user);
            setUsers(users.filter(u => u.id_user !== id_user));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.cardContainer} elevation={2}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {item.nom} {item.prenom}
            </Text>

            <Text style={styles.details}>📧 {item.email}</Text>
            <Text style={styles.role}>Rôle : {item.role}</Text>
          </View>

          <View style={styles.buttonsRow}>
            <C_button
              icon="eye-outline"
              size={24}
              color="#fff"
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate('Detail', {
                data: item,
                type: 'user'
                })
              }
            />

            <C_button
              icon="pencil-outline"
              size={24}
              color="#fff"
              style={[styles.actionButton, { backgroundColor: '#4e9bde' }]}
              onPress={() =>
                navigation.navigate('AddUser', { userData: item })
              }
            />

            <C_button
              icon="trash-outline"
              size={24}
              color="#fff"
              style={[styles.actionButton, { backgroundColor: '#f44336' }]}
              onPress={() => handleDelete(item.id_user)}
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
        text="Gestion des Utilisateurs"
        icon="chevron-back"
        size={30}
        onclickIcon={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2BB673" />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun utilisateur disponible</Text>
        </View>
      ) : (
        <CustomFlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_user?.toString()}
          title="Liste des utilisateurs"
        />
      )}

      <C_button
        title="+"
        onPress={() => navigation.navigate('AddUser')}
        style={styles.addButtonFloating}
        textstyle={{ fontSize: 30, color: '#fff', fontWeight: 'bold' }}
      />
    </View>
  );
};

export default ListUserScreen;

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
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
  role: {
    fontSize: 13,
    color: '#2BB673',
    marginTop: 2,
    fontWeight: '600',
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});