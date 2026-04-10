import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardAdmin from '../../screens/admin/DashboardAdmin';
import AddMedecin from '../../screens/medecin/Addmedecin';

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="DashboardAdmin" component={DashboardAdmin} />
    </Stack.Navigator>
  )
}

export default AdminNavigator;
