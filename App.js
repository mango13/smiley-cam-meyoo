import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Camera, Permissions } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [types, setTypes] = useState(null);
  useEffect(() => {
    (async () => {
      const types = await Camera.getAvailableCameraTypesAsync();
      alert(JSON.stringify(types));
      setTypes(types);
      if (Platform.OS === "web") {
        setHasPermission(true);
      } else {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === "granted");
      }
    })();
  }, []);

  if (hasPermission === true) {
    return (
      <View>
        <Text>Has permissions</Text>
      </View>
    );
  } else if (hasPermission === false) {
    return (
      <View>
        <Text>Don't have permission for this</Text>
      </View>
    );
  } else {
    return <ActivityIndicator />;
  }
}

