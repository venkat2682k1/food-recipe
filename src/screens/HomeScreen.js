import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, Image, TextInput} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage from @react-native-async-storage/async-storage
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Categories from "../components/Categories";
import axios from "axios";
import Recipes from "../components/Recipes";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";

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
  
  const handleViewFavorites = () => {
    navigation.navigate('FavoritesScreen');
  };

  

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        navigation.navigate('Register');
    }).catch((error) => {
        console.log(error.message);
    });
  };

  return (
    
    <View style={{flex:1,backgroundColor:"#ffd9b3"}}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:6,
        }}
        className="space-y-3 pt-3"
      >
        {/* Avatar and Logout Icon */}
        <View style={{ flexDirection: "row", justifyContent: "center",marginLeft:-330 }}>
          <TouchableOpacity onPress={handleViewFavorites}>
            <Image
              source={require("../../assets/image/heartman.png")}
              style={{
                width: hp(7),
                height: hp(7),
                marginTop:10,
                resizeMode: "cover",
                borderRadius: hp(1),
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center",marginLeft:330,marginBottom:-5}}>
          <TouchableOpacity onPress={handleSignOut}>
            <Image
              source={require("../../assets/image/signout.png")}
              style={{
                width: hp(6),
                height: hp(6),
                marginTop:-59,
                resizeMode: "cover",
                borderRadius: hp(3),
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Headlines */}
        <View style={{ marginBottom: 20,marginLeft:10}}>
          <Text style={{ fontSize: hp(3.5), fontWeight: "bold" }}>Fast & Delicious</Text>
          <Text style={{ fontSize: hp(3.5), fontWeight: "bold" }}>Food You <Text style={{ color: "#f64e32" }}>Love</Text></Text>
        </View>

        {/* Search Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 3, borderRadius: 25, borderColor: "black", paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={{ backgroundColor: "#ffd9b3", borderRadius: 23, padding: 10,paddingHorizontal: 5 }}>
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
        <View style={{margin:-10}}>
          {notFound ? (
            <Text>No food found with the given name.</Text>
          ) : (
            <Recipes 
              meals={meals} 
              categories={categories} 
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
