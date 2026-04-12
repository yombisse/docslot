import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

import AdminNavigator from "./adminNavigator";
import Userstack from "./GestionUsers/Userstack";
import Patientstack from "./GestionUsers/Patientstack";
import Medecinstack from "./GestionUsers/Medecinstack";
import PatientAgendaScreen from "../../screens/patient/Rdv";
import NotificationScreen from "../../screens/patient/NotificationScreen";

import { logout } from "../../services/authService";
import { getUnreadCount } from "../../services/notificationsService";

const Drawer = createDrawerNavigator();

// ================= CUSTOM DRAWER =================
function CustomDrawerContent(props) {

  const [unread, setUnread] = useState(0);

  const loadUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnread(res?.data?.total || 0);
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUnread();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logout();
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <DrawerContentScrollView {...props}>

      <DrawerItemList {...props} />

      {/* 🔔 NOTIFICATIONS AVEC BADGE */}
      <DrawerItem
        label="Notifications"
        icon={({ color, size }) => (
          <View>
            <Ionicons name="notifications-outline" size={size} color={color} />

            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unread > 99 ? "99+" : unread}
                </Text>
              </View>
            )}
          </View>
        )}
        onPress={() => props.navigation.navigate("Notifications")}
      />

      {/* 🚪 LOGOUT */}
      <DrawerItem
        label="Déconnexion"
        icon={({ color }) => (
          <Ionicons name="log-out-outline" size={22} color="red" />
        )}
        labelStyle={{ color: "red" }}
        onPress={handleLogout}
      />

    </DrawerContentScrollView>
  );
}

// ================= DRAWER =================
export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#2BB673" },
        headerTintColor: "#fff",
        drawerActiveBackgroundColor: "#2BB673",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: { fontSize: 16 },
        headerShown: false,
      }}
    >

      <Drawer.Screen
        name="Dashboard"
        component={AdminNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Utilisateurs"
        component={Userstack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Patients"
        component={Patientstack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Medecins"
        component={Medecinstack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="RendezVous"
        component={PatientAgendaScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          drawerItemStyle: { display: "none" }
        }}
      />

    </Drawer.Navigator>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});