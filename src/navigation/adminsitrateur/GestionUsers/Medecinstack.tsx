import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddMedecin from '../../../screens/medecin/Addmedecin';
import ListMedecins from '../../../screens/medecin/ListMedecins';

const Stack = createStackNavigator();

const Medecinstack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='ListMedecins'
    >
      <Stack.Screen name="ListMedecins" component={ListMedecins} />
      <Stack.Screen name="AddMedecin" component={AddMedecin} />
    </Stack.Navigator>
  )
}

export default Medecinstack;
