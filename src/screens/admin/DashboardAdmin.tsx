import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import C_header from '../../componnents/C_header'
import C_button from '../../componnents/C_button'

const DashboardAdmin = ({navigation}) => {
  return (
    <View style={styles.container}>
     <C_header text='Dashboard Admin' icon='chevron-back'/>
     <C_button title='Ajouter un médecin' onPress={()=>navigation.navigate('AddMedecin')} style={styles.button}/>

    </View>
  )
}

export default DashboardAdmin

const styles = StyleSheet.create({
  container:{
    flex:1,
    
  },
  button:{
    margin:20,
    backgroundColor:'#2BB673',
    padding:15,
    borderRadius:10,
    alignItems:'center'
  }
})