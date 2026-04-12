import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import C_text from '../../componnents/C_text';


const { height: screenHeight } = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animate logo and fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate to Login after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, logoScaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2BB673" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={[
            styles.logo,
            {
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#2BB673" style={styles.spinner} />
        <C_text text='DocSlot' textstyle={styles.appName}/>
        <C_text text='Votre rendez-vous médical simplifié' textstyle={styles.slogan}/>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2BB673',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  spinner: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
});

export default SplashScreen;

