import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

// Opretter en stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Notes' }} />
          <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Note Detail' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}