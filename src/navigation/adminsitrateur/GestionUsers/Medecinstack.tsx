import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddMedecin from '../../../screens/medecin/Addmedecin';
import ListMedecins from '../../../screens/medecin/ListMedecins';
import DetailsScreen from './Detailscreen';

const Stack = createStackNavigator();

const Medecinstack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='ListMedecins'
    >
      <Stack.Screen name="ListMedecins" component={ListMedecins} />
      <Stack.Screen name="AddMedecin" component={AddMedecin} />
      <Stack.Screen name="Detail" component={DetailsScreen} />
    </Stack.Navigator>
  )
}

export default Medecinstack;
