import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';


export default function RegistrationScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation=useNavigation()

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        navigation.navigate('Home');
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.email)
        navigation.navigate('Home', { userEmail: email });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <View style={{flex:1,backgroundColor: 'whitesmoke',justifyContent:'center',marginTop:200}}>
  
      <View style={{ padding: 85, gap: 15, backgroundColor: 'lightgray', borderRadius: 20,elevation:20,margin:20 }}>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 0.5, padding: 15 }}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={{ borderWidth: 0.5, padding: 15 }}
      />
          <View style={{ margin: 10, gap: 15 }}>
           <TouchableOpacity onPress={handleSignIn} style={{ backgroundColor: 'red', padding: 10, borderRadius: 30 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Sign-In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignUp} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 30,}}>
              
              <Text style={{ color: 'white', textAlign: 'center' }}>Sign-Up</Text>
            </TouchableOpacity>

          </View>
      </View>

    </View>
  );
}