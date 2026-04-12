import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddDisponibilite from '../../screens/medecin/AddDisponnibilite';
import MesDisponnibiltes from '../../screens/medecin/MesDisponnibiltes';
import NotificationScreen from '../../screens/patient/NotificationScreen';

const Stack = createStackNavigator();

const DisponnibiliteStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='MesDisponnibilites'
    >
      
      <Stack.Screen name="MesDisponnibilites" component={MesDisponnibiltes} />
       <Stack.Screen name="AddDisponibilite" component={AddDisponibilite} />
       <Stack.Screen name="Notification" component={NotificationScreen} />
     
    </Stack.Navigator>
  )
}

export default DisponnibiliteStack;
