import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardMedecin from '../../screens/medecin/DashboardMedecin';
import AddMedecin from '../../screens/medecin/Addmedecin';
import AddDisponibilite from '../../screens/medecin/AddDisponnibilite';
import ListMedecins from '../../screens/medecin/ListMedecins';
import NotificationScreen from '../../screens/patient/NotificationScreen';

const Stack = createStackNavigator();

const MedecinNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='ListMedecins'
    >
      
      <Stack.Screen name="DashboardMedecin" component={DashboardMedecin} />
      <Stack.Screen name="ListMedecins" component={ListMedecins} />
      <Stack.Screen name="AddMedecin" component={AddMedecin} />
      <Stack.Screen name="AddDisponibilite" component={AddDisponibilite} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  )
}

export default MedecinNavigator;
