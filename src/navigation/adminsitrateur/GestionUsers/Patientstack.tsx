import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListPatientScreen from '../../../screens/patient/ListPatients';
import AddPatient from '../../../screens/patient/AddPatient';
import DetailsScreen from './Detailscreen';

const Stack = createStackNavigator();

const Patientstack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='ListPatients'
    >
      <Stack.Screen name="ListPatients" component={ListPatientScreen} />
      <Stack.Screen name="AddPatient" component={AddPatient} />
      <Stack.Screen name="Detail" component={DetailsScreen} />
    </Stack.Navigator>
  )
}

export default Patientstack;
