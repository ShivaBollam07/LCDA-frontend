import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { HCard } from "./HomeCard";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LandingPage = ({ navigation }) => {
  const [data, setData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const storedData = await AsyncStorage.getItem("photoData");
          if (storedData !== null) {
            setData(JSON.parse(storedData));
          }
        } catch (error) {
          console.log("Failed to load data", error);
        }
      };
      loadData();
    }, [])
  );


  return (
    <View style={styles.container}>
      <FlatList
        style={styles.FList}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HCard
            title={item.title}
            predText={item.prediction}
            imageUri={item.imageUri}
          />
        )}
      />
      <View style={styles.addButton}>
        <TouchableOpacity
          style={styles.camNavButton}
          onPress={() => navigation.navigate("VirusCamera")}
        >
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../assets/icons/PicIcon.png")}
          />
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
    backgroundColor: "#F5FCAF",
  },
  FList: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  camNavButton: {
    padding: 5,
    borderRadius: 40,
  },

  addButton: {
    position: "absolute",
    bottom: 20,
    padding: 8,
    flexDirection: "row",
    backgroundColor: "green",
    borderRadius: 40,
    justifyContent: "space-around",
    alignItems: "center",
    width: "30%",
  },
  separator: {
    color: "lightgrey",
    fontSize: 20,
  },
});

export { LandingPage };
