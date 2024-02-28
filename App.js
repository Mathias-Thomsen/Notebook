import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

// Opretter en stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Notes' }} /> 
        <Stack.Screen name="DetailPage" component={DetailScreen} options={{ title: 'Note Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
