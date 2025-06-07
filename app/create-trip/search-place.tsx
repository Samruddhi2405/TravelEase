import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CreateTripContext } from "@/context/CreateTripContext";

const GEOAPIFY_API_KEY = "169fa9a94ce74674bc3d02f84c84dd29";

const SearchPlace = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        query
      )}&apiKey=${GEOAPIFY_API_KEY}&limit=10`;
      
      console.log("Making request to:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Full API response:", JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error("Geoapify API error:", data.error);
        Alert.alert("Search Error", "Failed to search places. Please try again.");
        setSearchResults([]);
        return;
      }

      if (!data.features || data.features.length === 0) {
        console.log("No results found");
        setSearchResults([]);
        return;
      }

      console.log("Found results:", data.features.length);
      setSearchResults(data.features);
    } catch (error) {
      console.error("Error searching places:", error);
      Alert.alert("Search Error", "Failed to search places. Please try again.");
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  const handlePlaceSelect = (place: any) => {
    console.log("Selected place:", place);
    setTripData((prev) => {
      const newData = prev.filter((item) => !item.locationInfo);
      return [
        ...newData,
        {
          locationInfo: {
            name: place.properties.formatted,
            coordinates: {
              lat: place.properties.lat,
              lng: place.properties.lon,
            },
            url: place.properties.datasource?.raw?.url || "",
            photoRef: place.properties.datasource?.raw?.photo_reference || "",
          },
        },
      ];
    });
    router.push("/create-trip/select-traveler");
  };

  const renderPlaceItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handlePlaceSelect(item)}
      className="p-4 border-b border-gray-200"
    >
      <Text className="font-outfit-medium text-base">{item.properties.formatted}</Text>
      <Text className="font-outfit text-sm text-gray-500">
        {item.properties.country}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        <View className="flex flex-col items-center">
          <Text className="text-5xl font-outfit-bold mt-20 px-3 mb-2">
            Where do you want to go?
          </Text>
          <Text className="text-lg text-gray-400 font-outfit">
            Find your destination!
          </Text>
        </View>

        <View className="px-4 mt-4">
          <View className="relative">
            <TextInput
              className="h-14 bg-gray-200 rounded-full px-4 text-base font-outfit-medium"
              placeholder="Search for a place"
              placeholderTextColor="#818181"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.length >= 2) {
                  searchPlaces(text);
                } else {
                  setSearchResults([]);
                }
              }}
              returnKeyType="search"
            />
            {isLoading && (
              <View className="absolute right-4 top-4">
                <ActivityIndicator size="small" color="#8b5cf6" />
              </View>
            )}
          </View>

          {searchResults.length > 0 && (
            <View className="mt-2 bg-white rounded-lg shadow-lg">
              <FlatList
                data={searchResults}
                renderItem={renderPlaceItem}
                keyExtractor={(item) => item.properties.place_id}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchPlace;
