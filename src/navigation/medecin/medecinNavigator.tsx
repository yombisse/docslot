import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardMedecin from '../../screens/medecin/DashboardMedecin';
import AddMedecin from '../../screens/medecin/Addmedecin';

const Stack = createStackNavigator();

const MedecinNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="DashboardMedecin" component={DashboardMedecin} />
    </Stack.Navigator>
  )
}

export default MedecinNavigator;
