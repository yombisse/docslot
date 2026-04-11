import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddMedecin from '../../../screens/medecin/Addmedecin';
import ListMedecins from '../../../screens/medecin/ListMedecins';
import ListUserScreen from './ListUsers';
import AddEditUserScreen from './AddUser';
import DetailsScreen from './Detailscreen';

const Stack = createStackNavigator();

const Userstack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='ListUsers'
    >
      <Stack.Screen name="ListUsers" component={ListUserScreen} />
      <Stack.Screen name="AddUser" component={AddEditUserScreen} />
       <Stack.Screen name="Detail" component={DetailsScreen} />
    </Stack.Navigator>
  )
}

export default Userstack;
