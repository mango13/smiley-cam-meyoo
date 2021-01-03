import React, { useState, useEffect } from "react";
import { Platform, ActivityIndicator, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components/native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [types, setTypes] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
        // alert(JSON.stringify(types));
        const types = await Camera.getAvailableCameraTypesAsync();
        setTypes(types);
        setHasPermission(true);
      } else {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === "granted");
      }
    })();
  }, []);

  if (hasPermission === true) {
    return (
      <CenterView>
        <Camera
          style={{
            width: WIDTH - 40,
            height: HEIGHT / 1.5,
            borderRadius: 20,
            overflow: "hidden",
          }}
          type={Camera.Constants.Type.front}
        />
      </CenterView>
    );
  } else if (hasPermission === false) {
    return (
      <CenterView>
        <Text>Don't have permission for this</Text>
      </CenterView>
    );
  } else {
    return (
      <CenterView>
        <ActivityIndicator />
      </CenterView>
    );
  }
}
