import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import DashboardMedecin from "../../screens/medecin/DashboardMedecin";
import DisponnibiliteStack from "./DisponnibiliteStack";
import UpdateProfileScreen from "../../screens/patient/updateProfile";
import RdvStack from "../patient/rdvStack";
import MedecinNavigator from "./medecinNavigator";
import Medecinstack from "./Medecinstack";


const Tab = createBottomTabNavigator();

export default function MedecinTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "MesRendezvous") {
            iconName = "calendar";
          } else if (route.name === "Disponnibilite") {
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
      <Tab.Screen name="Dashboard" component={Medecinstack} />
      <Tab.Screen name="MesRendezvous" component={RdvStack} />
      <Tab.Screen name="Disponnibilite" component={DisponnibiliteStack} />
    </Tab.Navigator>
  );
}
