import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import C_header from '../../componnents/C_header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import C_text from '../../componnents/C_text';

const DashboardPatient = () => {
  return (
    <View>
      <C_header style={styles.header}>
        <C_text text='Docslot' textstyle={styles.headText}/>
        <Ionicons name="notifications-outline" size={24} color="#fff" style={{marginRight:15}} />
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </C_header>
      <View style={{padding:20}}>
        <C_text text="Bienvenue sur votre tableau de bord!" textstyle={styles.welcome}/>
        <C_text text="Ici, vous pouvez consulter vos rendez-vous, vos prescriptions et vos messages avec votre médecin." textstyle={{fontSize:16, color:'#555'}}/>
      </View>

    </View>
  )
}

export default DashboardPatient;

const styles = StyleSheet.create({
  header:{
    backgroundColor: '#2BB673',
    paddingHorizontal: 15,
    elevation: 3,
    justifyContent: 'space-between',
    height: 70,
  },
  logo:{
    width: 90,
    height: 90,
    borderRadius: 45,
    
    marginVertical:5
  },
  headText:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: '50%',
   
  },
  welcome:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  
})