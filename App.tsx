import React from "react";
import {View,Text,StyleSheet, StatusBar} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/rootNavigator";

export default function App(){
  return(
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#2BB673" />
        <RootNavigator />
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff"
  },
  text:{
    fontSize:24,
    fontWeight:"bold",
    color:"#333"
  }
});