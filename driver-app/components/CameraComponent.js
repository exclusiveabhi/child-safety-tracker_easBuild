import React, { useRef, useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { detectFaces } from '../services/faceRecognition';
import { scanFace } from '../services/api';

const CameraComponent = ({ onScanSuccess }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const devices = useCameraDevices();
  const device = devices.front;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const handleScan = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({ base64: true });
      const faces = await detectFaces(photo.path);

      if (faces.length > 0) {
        const response = await scanFace(photo.base64);
        if (response.data.success) {
          Alert.alert('Success', 'Student recognized');
          onScanSuccess();
        } else {
          Alert.alert('Error', 'Student not recognized');
        }
      } else {
        Alert.alert('Error', 'No face detected');
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (device == null) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        ref={cameraRef}
      />
      <Button title="Scan Face" onPress={handleScan} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '80%',
  },
});

export default CameraComponent;