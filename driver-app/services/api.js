import axios from 'axios';
import { DEVICE_IP } from '@env';

const api = axios.create({
  baseURL: DEVICE_IP,
});

export const login = (busNumber, password) => {
  return api.post('/login', { busNumber, password });
};

export const register = (busNumber, password, route) => {
  return api.post('/register', { busNumber, password, route });
};

export const scanFace = (imageData) => {
  return api.post('/scan-face', { image: imageData });
};

export const markPickupCompleted = (busNumber) => {
  return api.post('/mark-pickup-completed', { busNumber });
};

export const markDropoffCompleted = (busNumber) => {
  return api.post('/mark-dropoff-completed', { busNumber });
};

export const getStudentsByBusNumber = (busNumber) => {
  return api.get(`/students/${busNumber}`);
};