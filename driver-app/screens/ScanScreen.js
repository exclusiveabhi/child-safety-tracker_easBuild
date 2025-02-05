import React from 'react';
import { View, StyleSheet } from 'react-native';
import CameraComponent from '../components/CameraComponent';

const ScanScreen = ({ route, navigation }) => {
  const { busNumber, type } = route.params;

  const handleScanSuccess = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CameraComponent onScanSuccess={handleScanSuccess} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScanScreen;