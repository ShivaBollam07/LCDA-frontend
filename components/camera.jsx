import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { useRef, useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { ActivityIndicator } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";

export function VirusCamera({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    requestGalleryPermission();
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", color: "white", margin: 5 }}>
          LCDVirus app would like to use your camera
        </Text>
        <Button onPress={requestPermission} title="Allow Camera" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function requestGalleryPermission() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("LCDVirus App needs access to your gallery");
    }
  }

  async function uploadImage(uri) {
    const formData = new FormData();
    formData.append("image", {
      uri: uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    let result = {};

    try {
      const response = await fetch(
        "https://lcda-backend.onrender.com/predict",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      result = await response.json();
      console.log("Upload success:", result);
    } catch (error) {
      console.error("Upload error:", error);
    }
    return result;
  }

  async function takePictureAndSave() {
    if (cameraRef.current) {
      setIsLoading(true);
  
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
  
      const asset = await MediaLibrary.createAssetAsync(data.uri);
      await MediaLibrary.createAlbumAsync("LCDVirus App", asset, false);
      const { prediction, success } = await uploadImage(data.uri);
  
      try {
        const newPhoto = {
          id: Date.now().toString(),
          title: `Photo ${Date.now()}`,
          prediction: prediction,
          imageUri: data.uri,
        };
        
        const existingData = await AsyncStorage.getItem("photoData");
        let photoArray = existingData ? JSON.parse(existingData) : [];
        photoArray.unshift(newPhoto);
  
        await AsyncStorage.setItem("photoData", JSON.stringify(photoArray));
      } catch (error) {
        console.error("Error saving to AsyncStorage:", error);
      }
  
      await fetchPhotos();
  
      setIsLoading(false);
      navigation.navigate("LandingPage");
    }
  }

  async function pickImageFromGallery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const { prediction, success } = await uploadImage(uri);

      try {
        const newPhoto = {
          id: Date.now().toString(),
          title: `Photo ${Date.now()}`,
          prediction: prediction,
          imageUri: uri,
        };
        
        const existingData = await AsyncStorage.getItem("photoData");
        let photoArray = existingData ? JSON.parse(existingData) : [];
        photoArray.unshift(newPhoto);

        await AsyncStorage.setItem("photoData", JSON.stringify(photoArray));
      } catch (error) {
        console.error("Error saving to AsyncStorage:", error);
      }

      fetchPhotos();
      navigation.navigate("LandingPage");
    }
  }

  async function fetchPhotos() {
    const album = await MediaLibrary.getAlbumAsync("LCDVirus App");
    if (album) {
      const photos = await MediaLibrary.getAssetsAsync({ album: album });
      setPhotos(photos.assets);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button3} onPress={toggleCameraFacing}>
            <Image
              style={styles.sideicon}
              source={require("../assets/icons/FlipCam.png")}
            />
          </TouchableOpacity>
   
          <TouchableOpacity style={styles.button} onPress={takePictureAndSave}>
            <Image
              style={styles.camicon}
              source={require("../assets/icons/CamIcon.png")}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button4} onPress={pickImageFromGallery}>
            <Image
              style={styles.sideicon}
              source={require("../assets/icons/Gallery.png")} 
            />
          </TouchableOpacity>
        </View>
     
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  camera: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: "transparent",
    bottom: "15%",
  },
  button2: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "transparent",
    alignItems: "center",
    bottom: "20%",
  },
  button3: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "transparent",
    alignItems: "center",
    bottom: "20%",
  },
  button4: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "transparent",
    alignItems: "center",
    bottom: "20%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  camicon: {
    height: 90,
    width: 90,
  },
  sideicon: {
    height: 45,
    width: 45,
    color: "white"
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    height: 200,
    backgroundColor: "rgba(16, 31, 29, 0.8)",
  },
  bottomViewText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },
});
