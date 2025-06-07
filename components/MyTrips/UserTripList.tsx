import { View, Text, Image } from "react-native";
import React from "react";
import moment from "moment";
import CustomButton from "../CustomButton";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=2071&auto=format&fit=crop";

const UserTripList = ({ userTrips }: { userTrips: any[] }) => {
  const router = useRouter();

  // Sort trips by start date
  const sortedTrips = [...userTrips].sort((a, b) => {
    const aData = JSON.parse(a.tripData);
    const bData = JSON.parse(b.tripData);

    const aStartDate = aData.find((item: any) => item.dates)?.dates?.startDate;
    const bStartDate = bData.find((item: any) => item.dates)?.dates?.startDate;

    return moment(aStartDate).valueOf() - moment(bStartDate).valueOf();
  });

  const LatestTrip = JSON.parse(sortedTrips[0]?.tripData);

  const locationInfo = LatestTrip?.find(
    (item: any) => item.locationInfo
  )?.locationInfo;

  const startDate = LatestTrip?.find((item: any) => item.dates)?.dates
    ?.startDate;
  const endDate = LatestTrip?.find((item: any) => item.dates)?.dates?.endDate;
  const travelersType = LatestTrip?.find((item: any) => item.travelers)
    ?.travelers?.type;

  const isPastTrip = moment().isAfter(moment(endDate));

  return (
    <View className="mb-16">
      <View>
        {locationInfo?.photoRef && (
          <Image
            source={{
              uri: locationInfo?.photoRef || DEFAULT_IMAGE_URL
            }}
            className={`w-full h-60 rounded-2xl mt-5 ${
              isPastTrip ? "grayscale" : ""
            }`}
          />
        )}
        <View className="mt-3">
          <Text
            className={`font-outfit-medium text-xl ${
              isPastTrip ? "text-gray-500" : ""
            }`}
          >
            {sortedTrips[0]?.tripPlan?.trip_plan?.location}
          </Text>
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="font-outfit text-lg text-gray-500">
              {moment(startDate).format("DD MMM yyyy")}
            </Text>
            <Text className="font-outfit-medium mr-5 text-lg text-gray-500">
              🚌 {travelersType}
            </Text>
          </View>

          <CustomButton
            title="View Trip"
            onPress={() =>
              router.push({
                pathname: "/trip-details",
                params: {
                  tripData: sortedTrips[0].tripData,
                  tripPlan: JSON.stringify(sortedTrips[0].tripPlan),
                },
              })
            }
            className={`mt-3 ${isPastTrip ? "opacity-50" : ""}`}
          />
        </View>

        <View className="h-0.5 bg-gray-200 mt-4 mb-2" />

        {sortedTrips?.slice(1).map((trip, idx) => (
          <UserTripCard trip={trip} key={idx} />
        ))}
      </View>
    </View>
  );
};

export default UserTripList;
