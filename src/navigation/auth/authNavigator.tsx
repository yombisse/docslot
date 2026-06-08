import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/auth/LoginScreen'
import RegisterScreen from '../../screens/auth/RegisterScreen';
import SplashScreen from '../../screens/auth/SplashScreen';

const Stack = createStackNavigator();

const AuthNavigator = () : React.ReactElement => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;


