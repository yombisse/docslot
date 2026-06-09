import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddDisponibilite from '../../screens/medecin/AddDisponnibilite';
import MesDisponnibiltes from '../../screens/medecin/MesDisponnibiltes';
import ListMedecinsDisponibles from '../../screens/medecin/ListMedecinsDisponnibles';
import MedecinCreneauxScreen from '../../screens/medecin/CreneauxMedecinScreen';
import MesRendezVous from '../../screens/medecin/MesRendezvous';
import PatientAgendaScreen from '../../screens/patient/Rdv';
import RendezVousTabs from '../../screens/patient/MesRdv';
import DashboardPatient from '../../screens/patient/DashboardPatient';
import RendezvousListScreen from '../../screens/admin/ListRendezvousScreen';

const Stack = createStackNavigator();

const RdvStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}
      initialRouteName='MesRendezvous'
    >
      <Stack.Screen name="DashboardPatient" component={DashboardPatient} />
      <Stack.Screen name="MesRendezvous" component={RendezVousTabs} />
      <Stack.Screen name="AddRendezvous" component={ListMedecinsDisponibles} />
      <Stack.Screen name="MedecinCreneaux" component={MedecinCreneauxScreen}/>
      <Stack.Screen name="AllRendezvous" component={RendezvousListScreen}/>
    </Stack.Navigator>
  )
}

export default RdvStack;
