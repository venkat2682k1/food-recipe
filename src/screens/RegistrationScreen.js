import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Import eye icons
import { Ionicons } from '@expo/vector-icons';


export default function RegistrationScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSignUp = () => {
    // Check if email is empty
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    // Check if password is empty or less than 8 characters
    if (!password.trim() || password.trim().length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        navigation.navigate('Home');
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = '';
        switch (errorCode) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email already in use';
            break;
          default:
            errorMessage = error.message;
            break;
        }
        setError(errorMessage);
      });
  };

  const handleSignIn = () => {
    // Check if email is empty
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    // Check if password is empty
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.email);
        navigation.navigate('Home', { userEmail: email });
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = '';
        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/user-not-found':
            errorMessage = 'User not found';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password';
            break;
          default:
            errorMessage = error.message;
            break;
        }
        setError(errorMessage);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="bg-[#ff1a1a] flex-1 justify-center items-center space-y-10 relative">
        <Image
          source={require("../../assets/image/Background.png")}
          style={{
            position: "absolute",
            width: wp(100),
            height: hp(120),
            resizeMode: "cover",
          }}
        />
        <Image
          source={require("../../assets/image/new.png")}
          style={{
            position: "absolute",
            width: wp(100),
            height: hp(120),
            resizeMode: "cover",
          }}
        />
        <View className=" flex-1 justify-center items-center space-y-10 relative size={5}">
          <Image
            source={require("../../assets/image/chef.png.png")}
            style={{
              width: wp(50), // Adjust the width as needed
              height: hp(23), // Adjust the height as needed
              resizeMode: "contain",
              marginBottom:-40,
              marginTop:-10
            }}
          />
        </View>
        <Text style={{ fontWeight: "bold", marginLeft: 100, marginRight: -10, fontSize: 50, width: 300, justifyContent: 'center', color: '#ffe6e6'}}>Welcome</Text>

        <View style={{ padding: 50, gap: 15, backgroundColor: '#ffffcc', borderRadius: 30, elevation: 20, marginBottom:200, width: 350, alignItems:'center'}}>
          <Text style={{ fontWeight: "bold", marginBottom: -49, fontSize: 20,marginLeft:-150 }}>Email :</Text>
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            style={{ borderWidth: 1, padding: 10, marginLeft: 80, marginBottom: 30, width: 150, alignSelf:'center'}}
          />
          <Text style={{ fontWeight: "bold", marginLeft:-190, marginBottom: -50, fontSize: 20 }}>Password :</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="black" />
            </TouchableOpacity>
          </View>
          {error !== '' && <Text style={{ color: 'black', textAlign: 'center' }}>{error}</Text>}
          <Text onPress={handleClear} style={{ color: 'blue', textAlign: 'center', textDecorationLine: 'underline', marginLeft: 250, marginBottom: -40, width: 100 }}>Clear..</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginLeft: 5 }}>
            <View style={{ flexDirection: "row", gap: 30, marginTop: 20, marginLeft: -20 }}>
              <TouchableOpacity onPress={handleSignIn} style={{ backgroundColor: 'green', padding: 10, borderRadius: 45 }}>
                <Text style={{ color: 'white', textAlign: 'center', padding: 1 }}>Sign-In</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSignUp} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 35, }}>

                <Text style={{ color: 'white', textAlign: 'center' }}>Sign-Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    marginLeft: 80,
    width: 150
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    marginLeft: 10,
  },
});
