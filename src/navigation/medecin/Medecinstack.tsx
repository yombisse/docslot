import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardMedecin from '../../screens/medecin/DashboardMedecin';
import AddMedecin from '../../screens/medecin/Addmedecin';
import AddDisponibilite from '../../screens/medecin/AddDisponnibilite';
import ListMedecins from '../../screens/medecin/ListMedecins';
import NotificationScreen from '../../screens/patient/NotificationScreen';
import ProfileMedecin from '../../screens/medecin/MonProfileScreen';

const Stack = createStackNavigator();

const Medecinstack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='DashboardMedecin'
    >
      
      <Stack.Screen name="DashboardMedecin" component={DashboardMedecin} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="ProfileMedecin" component={ProfileMedecin} />
    </Stack.Navigator>
  )
}

export default Medecinstack;
