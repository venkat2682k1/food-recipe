import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export default function WelcomeScreen() {
  const animation = useRef(null);
  const navigation = useNavigation();
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 50, // Adjust the duration for faster blinking
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100, // Adjust the duration for faster blinking
          useNativeDriver: true,
        }),
      ]).start();
    }, 200); // Adjust the interval between each blink

    return () => clearInterval(interval);
  }, [opacity]);

  return (
    <View className="bg-[#f64e32] flex-1 justify-center items-center space-y-10 relative">
      <Image
        source={require("../../assets/image/new.png")}
        style={{
          position: "absolute",
          width: wp(100),
          height: hp(120),
          resizeMode: "cover",
        }}
      />
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
        source={require("../../assets/image/newfood.png")}
        style={{
          position: "absolute",
          width: wp(100),
          height: hp(50),
          marginLeft: 40,
          marginRight: 40,
          marginBottom: 10,
          marginTop: -40, // Adjusted marginTop value to move the image down
          marginEnd: 0,
          marginHorizontal: 0,
          resizeMode: "cover",
        }}
      />

      <StatusBar style="light" />

      {/* Lottie Logo */}
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          bottom: -19,
          marginRight: -250,
        }}
      >
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: wp(20),
            height: hp(30),
          }}
          source={require("../../assets/lottie/food-logo.json")}
        />
      </View>

      {/* Title and Subtitle */}
      <View
        style={{
          flexDirection: "column-reverse",
          alignItems: "center",
          marginBottom: 70,
          marginTop: 110,
        }}
      >
        <Text
          style={{
            fontSize: hp(5),
            color: "white",
            fontWeight: "bold",
            marginLeft: -55,
            marginTop: -170,
            marginBottom: 140,
            letterSpacing: 3,
            // Adjust this value to fine-tune the upward movement
          }}
        >
          Food Cafe
        </Text>

        <Text
          style={{
            fontSize: hp(3),
            color: "white",
            fontWeight: "bold",
            marginBottom: 80,
            letterSpacing: 1,
            marginTop: -110, // Adjust this value to fine-tune the upward movement
          }}
        >
          Explore Some Delicious Food
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center", marginBottom: 5, alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            paddingVertical: hp(1),
            paddingHorizontal: hp(5),
            borderRadius: hp(3),
          }}
          onPress={() => navigation.navigate("Registration")}
        >
          <Animated.Text
            style={{
              color: "#f64e32",
              fontSize: hp(2.2),
              marginBottom: -2,
              fontWeight: "medium",
              opacity: opacity, // Apply opacity animation here
            }}
          >
            Get Started
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
