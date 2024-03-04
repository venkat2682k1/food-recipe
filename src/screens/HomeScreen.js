import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, SafeAreaView, Image, TextInput } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Categories from "../components/Categories";
import axios from "axios";
import Recipes from "../components/Recipes";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  async function getCategories() {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const getRecipes = async (category = "Beef") => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const searchMeals = async () => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      if (response && response.data) {
        if (response.data.meals) {
          setMeals(response.data.meals);
          setNotFound(false);
        } else {
          setMeals([]);
          setNotFound(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = () => {
    // Navigate back to the registration page
    navigation.navigate('Registration');
    // Clear registration form data
    clearRegistrationData(); // Assuming you have access to this function
  };

  // Function to clear registration form data (assuming it's accessible here)
  const clearRegistrationData = () => {
    // Implement logic to clear registration form data
    // For example, you can call the clearForm function from RegistrationScreen component
    // clearForm();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 6,
          }}
          className="space-y-2 pt-14"
        >
          {/* Avatar and Logout Icon */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }}>
            <Image
              source={require("../../assets/image/man.png")}
              style={{
                width: hp(6),
                height: hp(6),
                resizeMode: "cover",
                borderRadius: hp(5),
              }}
            />
            <TouchableOpacity onPress={handleLogout}>
              <Image
                source={require("../../assets/image/LogOut.jpg")}
                style={{
                  width: hp(6),
                  height: hp(6),
                  resizeMode: "cover",
                  borderRadius: hp(6),
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Headlines */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: hp(3.5), fontWeight: "bold" }}>Fast & Delicious</Text>
            <Text style={{ fontSize: hp(3.5), fontWeight: "bold" }}>Food You <Text style={{ color: "#f64e32" }}>Love</Text></Text>
          </View>

          {/* Search Bar */}
          <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 3, borderRadius: 25, borderColor: "black", paddingHorizontal: 15, marginBottom: 10 }}>
            <View style={{ backgroundColor: "white", borderRadius: 23, padding: 10,paddingHorizontal: 5 }}>
              <MagnifyingGlassIcon size={hp(2.5)} color={"gray"} strokeWidth={4} />
            </View>
            <TextInput
              placeholder="Search Your Favorite Food"
              placeholderTextColor="gray"
              style={{ flex: 1, fontSize: hp(1.7), marginLeft: 10 }}
              onChangeText={(text) => setSearchTerm(text)}
              onSubmitEditing={searchMeals}
            />
          </View>
          
          {/* Categories */}
          <View>
            {categories.length > 0 && (
              <Categories
                categories={categories}
                activeCategory={activeCategory}
                handleChangeCategory={(category) => {
                  getRecipes(category);
                  setActiveCategory(category);
                  setMeals([]);
                }}
              />
            )}
          </View>

          {/* Recipes Meal */}
          <View>
            {notFound ? (
              <Text>No food found with the given name.</Text>
            ) : (
              <Recipes meals={meals} categories={categories} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
