import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardPatient from '../../screens/patient/DashboardPatient';
import MedecinListScreen from '../../screens/medecin/ListMedecinsDisponnibles';
import UpdateProfileScreen from '../../screens/patient/updateProfile';

const Stack = createStackNavigator();

const PatientNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="DashboardPatient" component={DashboardPatient} />
      <Stack.Screen name="ListMedecins" component={MedecinListScreen}/>
      <Stack.Screen name="MonProfile" component={UpdateProfileScreen}/>
    </Stack.Navigator>
  )
}

export default PatientNavigator;

