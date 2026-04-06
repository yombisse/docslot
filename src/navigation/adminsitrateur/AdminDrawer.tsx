import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import AdminTabs from "./AdminTab";



function Patients() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Gestion des Patients</Text>
    </View>
  );
}

function RendezVous() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Gestion des Rendez-vous</Text>
    </View>
  );
}

function Medecins() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Gestion des Médecins</Text>
    </View>
  );
}

function Parametres() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Paramètres</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
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
        name="AdminDrawer"
        component={AdminTabs}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Patients"
        component={Patients}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RendezVous"
        component={RendezVous}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Medecins"
        component={Medecins}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Parametres"
        component={Parametres}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2BB673",
  },
});
