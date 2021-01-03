import React, { useState, useEffect } from "react";
import {
  Platform,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

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

const IconBar = styled.View`
  margin-top: 50px;
`;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [types, setTypes] = useState(null);

  const switchCameraType = () => {
      if(cameraType === Camera.Constants.Type.front) {
          setCameraType(Camera.Constants.Type.back);
      } else {
          setCameraType(Camera.Constants.Type.front);
      }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
        console.log(types);
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
          type={cameraType}
        />
        <IconBar>
          <TouchableOpacity onPress={switchCameraType}>
            <MaterialIcons
              name={
                cameraType === Camera.Constants.Type.front
                  ? "camera-front"
                  : "camera-rear"
              }
              color="white"
              size={50}
            />
          </TouchableOpacity>
        </IconBar>
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
