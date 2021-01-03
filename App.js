import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FaceDetector from "expo-face-detector";
import * as FileSystem from "expo-file-system";

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
  const [smileDetected, setSmileDetected] = useState(false);

  const cameraRef = useRef();

  const switchCameraType = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const savePhoto = async (uri) => {


  };

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        let { uri } = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        if (uri) {
          savePhoto(uri);
        }
      }
    } catch (e) {
      alert(e);
      setSmileDetected(false);
    }
  };

  const onFacesDetected = ({ faces }) => {
    const face = faces[0];
    if (face && face.smilingProbability > 0.7) {
      setSmileDetected(true);
      takePhoto();
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
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
          onFacesDetected={smileDetected ? null : onFacesDetected}
          faceDetectorSettings={{
            detectLandmarks: FaceDetector.Constants.Landmarks.all,
            runClassifications: FaceDetector.Constants.Classifications.all,
          }}
          ref={cameraRef}
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
