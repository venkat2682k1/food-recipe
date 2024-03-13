import {
  View,
  Text,
  ScrollView,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../../utils/index";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon, ShareIcon } from "react-native-heroicons/solid";
import Loading from "../components/Loading";
import Animated, { FadeInDown } from "react-native-reanimated";
import axios from "axios";
import { Share } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RecipeDetailsScreen(props) {
  const item = props.route.params;
  const navigation = useNavigation();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);


  console.log("Meal", meal);

  useEffect(() => {
    getMealData(item.idMeal);
  });

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorite = await AsyncStorage.getItem(`favorite_${item.idMeal}`);
        setIsFavorite(favorite !== null);
      } catch (error) {
        console.log('Error checking favorite:', error.message);
      }
    };
    checkFavorite();
  }, []);
  

  const handleGoBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const toggleFavorite = async () => {
    try {
      if (!isFavorite) {
        // Add to favorites
        await AsyncStorage.setItem(`favorite_${item.idMeal}`, JSON.stringify(item));
      } else {
        // Remove from favorites
        await AsyncStorage.removeItem(`favorite_${item.idMeal}`);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log('Error toggling favorite:', error.message);
    }
  };
  

  const getMealData = async (id) => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );

      if (response && response.data) {
        setMeal(response.data.meals[0]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const ingredientsIndexes = (meal) => {
    if (!meal) return [];
    let indexes = [];

    for (let i = 1; i <= 20; i++) {
      if (meal["strIngredient" + i]) {
        indexes.push(i);
      }
    }

    return indexes;
  };
 const shareRecipe = async () => {
  try {
    if (!meal) {
      console.log("Recipe data not available");
      return;
    }

    const message = `Check out this recipe: ${meal.strMeal}\n\nIngredients:\n${ingredientsIndexes(meal)
      .map((i) => `${meal["strMeasure" + i]} ${meal["strIngredient" + i]}`)
      .join("\n")}\n\nInstructions:\n${meal.strInstructions}`;

    const imageUrl = meal.strMealThumb;

    const result = await Share.share({
      message: message,
      url: imageUrl, // Share image URL
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared via activity type
        console.log(`Shared via ${result.activityType}`);
      } else {
        // Shared
        console.log("Shared");
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
      console.log("Dismissed");
    }
  } catch (error) {
    console.log(error.message);
  }
};

  
  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom:0
  
      }}
    >
      <StatusBar style="white" />
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
           RecipeDetails
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
        <View style={{
              width: hp(4),
              height: hp(5.5),
              marginTop: -48,
              marginLeft:340,
              resizeMode: "cover"
            }}>
         
     <TouchableOpacity onPress={toggleFavorite}>
  {isFavorite ? (
    <HeartIcon color="#f64e32" size={30} />
  ) : (
    <HeartIcon color="white" size={38} />
  )}
</TouchableOpacity>


          </View>
        </View>

      {/* Recipe Image */}

      <View className="flex-row justify-center">
        <CachedImage
          uri={item.strMealThumb}
          sharedTransitionTag={item.strMeal}
          style={{
            width: wp(100),
            height: hp(45),
          }}
        />
      </View>

      {/* Back Button and Favorite Icon */}
        
  <View className="w-auto absolute  justify-between items-center" style={{marginTop
  :360,marginLeft:345}}>
     
          <View className="p-2 rounded-full bg-white mr-1">
          <TouchableOpacity onPress={shareRecipe}>
            <ShareIcon color="#f64e32" size={25} />
          </TouchableOpacity>
        </View>


        
      </View>

      {/* Meal Description */}
      
      {isLoading ? (
        <Loading size="large" className="mt-16" />
      ) : (
        <View
          className="px-4 flex justify-between space-y-4 bg-white mt-[-46]"
          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 50,
            paddingTop: hp(4),
            paddingBottom:10,
            backgroundColor:"#ffcc99"
          }}
        >
          {/* Meal Name */}
          <Animated.View
            className="space-y-2 px-4"
            entering={FadeInDown.delay(200)
              .duration(700)
              .springify()
              .damping(12)}
          >
            <Text
              className="font-bold flex-1 text-neutral-700"
              style={{
                fontSize: hp(3),
              }}
            >
              {meal?.strMeal}
            </Text>

            <Text
              style={{
                fontSize: hp(2),
              }}
              className="text-neutral-500 font-medium"
            >
              {meal?.strArea}
            </Text>
          </Animated.View>

          {/* Ingredients */}

          <Animated.View
            className="space-y-4 p-4"
            entering={FadeInDown.delay(300)
              .duration(700)
              .springify()
              .damping(12)}
          >
            <Text
              style={{
                fontSize: hp(2.5),
              }}
              className="font-bold flex-1 text-neutral-700"
            >
              Ingredients
            </Text>

            <View className="space-y-2 ml-3">
              {ingredientsIndexes(meal).map((i) => {
                return (
                  <View className="flex-row space-x-4 items-center" key={i}>
                    <View
                      className="bg-[#f64e32] rounded-full"
                      style={{
                        height: hp(1.5),
                        width: hp(1.5),
                      }}
                    />
                    <View className="flex-row space-x-2">
                      <Text
                        style={{
                          fontSize: hp(1.7),
                        }}
                        className="font-medium text-neutral-800"
                      >
                        {meal["strIngredient" + i]}
                      </Text>
                      <Text
                        className="font-extrabold text-neutral-700"
                        style={{
                          fontSize: hp(1.7),
                        }}
                      >
                        {meal["strMeasure" + i]}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {/* Instructions */}
          <Animated.View
            className="space-y-4 p-4"
            entering={FadeInDown.delay(400)
              .duration(700)
              .springify()
              .damping(12)}
          >
            <Text
              className="font-bold flex-1 text-neutral-700"
              style={{
                fontSize: hp(2.5),
              }}
            >
              Instructions
            </Text>

            <Text
              className="text-neutral-700"
              style={{
                fontSize: hp(1.7),
              }}
            >
              {meal?.strInstructions}
            </Text>
          </Animated.View>
        </View>
      )}
    </ScrollView>
  );
} 