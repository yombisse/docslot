import React, { useEffect } from "react";
import {View,Text,StyleSheet, StatusBar} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/rootNavigator";
import { ToastProvider, useToast } from "./src/utils/ToastContext";
import { setToastContext } from "./src/utils/errorHandler";

function AppContent() {
  const { showToast } = useToast();

  useEffect(() => {
    setToastContext({ showToast });
  }, [showToast]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#2BB673"  />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App(){
  return(
    <ToastProvider>
      <AppContent />
    </ToastProvider>
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