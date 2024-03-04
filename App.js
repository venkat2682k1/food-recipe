import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './src/screens/RegistrationScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyAur9nXG46-TuHZPkTDnFT1QgUUDe-9U7s",
  authDomain: "favfood-app-a3877.firebaseapp.com",
  projectId: "favfood-app-a3877",
  storageBucket: "favfood-app-a3877.appspot.com",
  messagingSenderId: "614291867275",
  appId: "1:614291867275:web:8b67356d8a52f09ddeb68e"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});;

const Stack=createStackNavigator()


export default function App() {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserEmail(user ? user.email : null);
     
    });

    return unsubscribe;
  }, []);

  console.log(userEmail)

  return (
    <NavigationContainer>
    <Stack.Navigator>
      {user ? (
        <>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
        <Stack.Screen name='RecipeDetails' component={RecipeDetailsScreen}/>
        </>
      ) : (
        <>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Register' component={RegistrationScreen} options={{headerShown:false}}/>
        </>
      )}
    </Stack.Navigator>
  </NavigationContainer>
  );
}

