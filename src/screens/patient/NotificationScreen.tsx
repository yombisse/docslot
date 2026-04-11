import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import C_header from '../../componnents/C_header';

import {
  getMyNotifications,
  getAllNotifications,
  markAsRead,
} from '../../services/notificationsService';

import { getProfile } from '../../services/userService';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===================== LOAD =====================
  const loadNotifications = async () => {
    try {
      setLoading(true);

      // 🔥 récupérer profil
      const profileRes = await getProfile();
      const role = profileRes.data.data.role;

      let res;

      // 🔥 ADMIN → toutes les notifications
      if (role === 'administrateur') {
        res = await getAllNotifications();
      }
      // 🔥 medecin / patient → notifications personnelles
      else {
        res = await getMyNotifications();
      }

      setNotifications(res.data.data);

    } catch (e) {
      console.log('Erreur notifications', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  // ===================== MARK AS READ =====================
  const handlePress = async (item) => {
    try {
      if (!item.lu) {
        await markAsRead(item.id_notification);
      }
      loadNotifications();
    } catch (e) {
      console.log(e);
    }
  };

  // ===================== ITEM =====================
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.lu && styles.unreadCard]}
      onPress={() => handlePress(item)}
    >
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  // ===================== LOADING =====================
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

  // ===================== UI =====================
  return (
    <View style={styles.container}>
      <C_header
        icon="chevron-back"
        text="Notifications"
        onclickIcon={() => navigation.goBack()}
      />

      {notifications.length === 0 ? (
        <Text style={styles.empty}>Aucune notification</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id_notification.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  unreadCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2BB673',
  },

  message: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
  },
});