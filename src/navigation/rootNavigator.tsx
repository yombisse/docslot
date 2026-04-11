import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PatientNavigator from './patient/patientNavigator';
import AuthNavigator from './auth/authNavigator';
import AdminNavigator from './adminsitrateur/adminNavigator';
import MedecinNavigator from './medecin/medecinNavigator';
import PatientTabs from './patient/PatientTab';
import AdminDrawer from './adminsitrateur/AdminDrawer';
import MedecinTabs from './medecin/MedecinTabs';


const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
    initialRouteName='Auth'
    >
        <Stack.Screen name="Auth" component={AuthNavigator} />    
        <Stack.Screen name="Patient" component={PatientTabs} />
        <Stack.Screen name="Medecin" component={MedecinTabs} />
        <Stack.Screen name="Admin" component={AdminDrawer} />
        
        
    </Stack.Navigator>
  )
}

export default RootNavigator;
