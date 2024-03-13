import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const favoriteKeys = keys.filter((key) => key.startsWith("favorite_"));
      const favoriteItems = await AsyncStorage.multiGet(favoriteKeys);

      // Filter out null values and parse favorite items
      const parsedFavorites = favoriteItems
        .filter(([_, value]) => value !== null && value !== undefined) // Ensure value is not null or undefined
        .map(([_, value]) => JSON.parse(value));

      // Fetch meal details (including ingredients) for each favorite item
      const favoritesWithDetails = await Promise.all(
        parsedFavorites.map(async (item) => {
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idMeal}`
          );
          return response.data.meals[0];
        })
      );

      setFavorites(favoritesWithDetails);
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
    }
  };

  const removeFromFavorites = async (idMeal) => {
    try {
      await AsyncStorage.removeItem(`favorite_${idMeal}`);
      // Fetch favorites again to update the list
      fetchFavorites();
    } catch (error) {
      console.error("Error removing from favorites:", error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  const handleFavoritePress = (item) => {
    if (item && item.idMeal !== undefined && item.idMeal !== null) {
      navigation.navigate("RecipeDetails", { item });
    } else {
      console.error("Invalid item:", item);
    }
  };

  const renderRecipeItem = ({ item }) => (
    <View style={{ backgroundColor: "#ffd9b3", margin:6, padding: 10, paddingBottom: 100,borderRadius:30, }}>
      <TouchableOpacity onPress={() => removeFromFavorites(item.idMeal)}>
        <Image
          source={require("../../assets/image/red.png")}
          style={{
            width: hp(4),
            height: hp(4),
            marginTop: 10,
            marginLeft: 320,
            resizeMode: "cover"
          }}
        />
      </TouchableOpacity>
      <View style={{ marginVertical: 1, marginTop: 20, alignItems: "center" }}>
        <Image
          source={{ uri: item?.strMealThumb }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 30,
          }}
        />
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20, fontSize: 20 }}>
            {item?.strMeal}
          </Text>
        </View>
      </View>
      <Text style={{ marginTop: 10 }}>{item?.strInstructions}</Text>
      {item && item.ingredients && (
        <FlatList
          data={item.ingredients}
          renderItem={({ ingredient }) => (
            <Text key={ingredient.idIngredient}>
              {ingredient.strIngredient} - {ingredient.strMeasure}
            </Text>
          )}
          keyExtractor={(ingredient) => ingredient.idIngredient}
        />
      )}
    </View>
  );

  return (
    <View>
      <View style={{ backgroundColor: "#ffcc99" }}>
        <Text
          style={{
            marginTop: 25,
            fontWeight: "bold",
            marginLeft: 100,
            fontSize: 25,
            padding: 13
          }}
        >
          Favorite Recipes
        </Text>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require("../../assets/image/back.png")}
            style={{
              width: hp(4),
              height: hp(5.5),
              marginTop: -46,
              resizeMode: "cover"
            }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={favorites}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.idMeal}
      />
    </View>
  );
}
