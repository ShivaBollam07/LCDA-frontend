import { Image, StyleSheet, Text, View } from "react-native";
import { VirusCamera } from "./components/camera";
import { LandingPage } from "./components/LandingPage";
import { PhotoGallery } from "./components/PhotoGallery";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export default function App() {
  function LogoTitle() {
    return (
      <View style={styles.title}>
        <Image
          style={{ width: 50, height: 50 }}
          source={require("./assets/icons/logo.png")}
        />
        <Text style= {styles.titleText}>LCD Virus Detection App</Text>
      </View>
    );
  }

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{
            headerStyle: { backgroundColor: "#254441" },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        />
        <Stack.Screen
          name="VirusCamera"
          component={VirusCamera}
          options={{
            headerStyle: { backgroundColor: "#254441" },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        />
        <Stack.Screen
          name="PhotoGallery"
          component={PhotoGallery}
          options={{
            headerStyle: { backgroundColor: "#254441" },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
    color: "white",
  },
  titleText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  }
});
