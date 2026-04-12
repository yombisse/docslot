import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import PatientNavigator from "./patientNavigator";
import MedecinListScreen from "../../screens/medecin/ListMedecinsDisponnibles";
import MesRendezVous from "../../screens/patient/MesRdv";
import RdvStack from "./rdvStack";
import UpdateProfileScreen from "../../screens/patient/updateProfile";


function MesRendezvous() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Mes Rendez-vous</Text>
    </View>
  );
}

function Medecins() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Liste des Médecins</Text>
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Mon Profil</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Rendezvous") {
            iconName = "calendar";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2BB673", // couleur principale Docslot
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={PatientNavigator} />
      <Tab.Screen name="Rendezvous" component={RdvStack} />
    </Tab.Navigator>
  );
}
