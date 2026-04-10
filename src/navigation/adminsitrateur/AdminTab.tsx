import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AdminNavigator from "./adminNavigator";
import ListMedecins from "../../screens/medecin/ListMedecins";
import MedecinNavigator from "../medecin/medecinNavigator";



function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Mon Profil</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "MesRendezvous") {
            iconName = "calendar";
          } else if (route.name === "Medecins") {
            iconName = "medkit";
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
      <Tab.Screen name="Dashboard" component={AdminNavigator} />
      <Tab.Screen name="Medecins" component={MedecinNavigator} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
