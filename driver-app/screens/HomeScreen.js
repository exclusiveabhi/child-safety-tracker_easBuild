import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { markPickupCompleted, markDropoffCompleted } from '../services/api';
import StudentsList from '../screens/StudentsList';

const HomeScreen = ({ route }) => {
  const { busNumber, driverRoute } = route.params;
  const [tracking, setTracking] = useState(false);
  const navigation = useNavigation();

  const handleScan = (type) => {
    navigation.navigate('Scan', { busNumber, type });
  };

  const handlePickupCompleted = async () => {
    try {
      await markPickupCompleted(busNumber);
      Alert.alert('Pickup Completed', 'All unscanned students marked as absent');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark pickup completed');
    }
  };

  const handleDropoffCompleted = async () => {
    try {
      await markDropoffCompleted(busNumber);
      Alert.alert('Drop-off Completed', 'Drop-off process completed');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark drop-off completed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome, Driver</Text>
        <Text style={styles.subtitle}>Bus Number: {busNumber}</Text>
        <Text style={styles.subtitle}>Route: {driverRoute}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleScan('pickup')}
        >
          <Text style={styles.buttonText}>Pickup Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePickupCompleted}
        >
          <Text style={styles.buttonText}>Pickup Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleScan('dropoff')}
        >
          <Text style={styles.buttonText}>Drop-off Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDropoffCompleted}
        >
          <Text style={styles.buttonText}>Drop-off Completed</Text>
        </TouchableOpacity>
      </View>
      <StudentsList busNumber={busNumber} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;