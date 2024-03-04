import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegistration = () => {
    // Validate form fields
    if (
      !name.trim() ||
      !sex.trim() ||
      !mobileNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !email.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password do not match.");
      return;
    }

    if (mobileNumber.length !== 10) {
      setError("Mobile number must be 10 digits.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address.");
      return;
    }

    // Implement registration logic here
    console.log("Registration details:", {
      name,
      sex,
      mobileNumber,
      email,
      password,
    });

    // Navigate to the welcome page after successful registration
    navigation.navigate("Home");
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const clearForm = () => {
    setName("");
    setSex("");
    setMobileNumber("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setError("");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/image/new.png")}
        style={{
          position: "absolute",
          width: wp(100),
          height: hp(120),
          resizeMode: "cover",
        }}
      />
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Food Cafe</Text> 
      </View>
      <View style={styles.formContainer}>
        <View style={[styles.inputContainer, { marginLeft: 70 }]}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>
        <View style={[styles.inputContainer, { marginLeft: 64 }]}>
          <Text style={styles.label}>Gender:</Text>
          <TouchableOpacity
            onPress={() => setSex("male")}
            style={[
              styles.sexButton,
              sex === "male" && { backgroundColor: "blue" },
            ]}  
          >
            <Text style={styles.buttonText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSex("female")}
            style={[
              styles.sexButton,
              sex === "female" && { backgroundColor: "blue" },
            ]}
          >
            <Text style={styles.buttonText}>Female</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputContainer, { marginLeft: 1 }]}>
          <Text style={styles.label}>Mobile Number:</Text>
          <TextInput
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>
        <View style={[styles.inputContainer, { marginLeft: 72 }]}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
        </View>
        <View style={[styles.inputContainer, { marginLeft: 42 }]}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        <View style={[styles.inputContainer, { marginLeft: -18 }]}>
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        {error !== "" && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          onPress={handleRegistration}
          style={styles.registerButton}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearForm} style={styles.clearButton}>
          <Text style={styles.buttonText}>Clear Form</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f64e32",
  },
  logoContainer: {
    marginBottom: hp(6),
    marginTop: 5,
  },
  logoText: {
    fontSize: hp(7),
    color: "white",
    fontWeight: "bold",
    letterSpacing: 3, // Adjust letter spacing
  },
  formContainer: {
    width: "60%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  label: {
    color: "white",
    marginRight: wp(10),
    marginLeft: -55,
    fontWeight: "bold",
    fontSize: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: "gray", // Adjust border color
    borderRadius: hp(2), // Adjust border radius
    paddingVertical: hp(1), // Adjust vertical padding
    paddingHorizontal: wp(3), // Adjust horizontal padding
    backgroundColor: "white", // Adjust background color
    color: "black", // Adjust text color
    textAlign: "left", // Align text to the left
    width: wp(50), // Adjust input box width
  },
  sexButton: {
    backgroundColor: "white",
    borderRadius: hp(2),
    padding: hp(1),
    textAlign: "center",
    marginRight: wp(6),
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: hp(2), // Adjust font size
    fontWeight: "bold", // Adjust font weight
  },
  registerButton: {
    backgroundColor: "blue",
    padding: hp(1),
    borderRadius: hp(10),
    marginTop: hp(4),
    marginLeft: 0,
  },
  clearButton: {
    backgroundColor: "red",
    padding: hp(1),
    borderRadius: hp(10),
    marginTop: hp(2),
    marginLeft: 0,
  },
  errorText: {
    color: "black",
    marginBottom: hp(0),
    fontSize: hp(1.5), // Adjust font size
    fontWeight: "bold", // Adjust font weight
  },
});

export default RegistrationScreen;
