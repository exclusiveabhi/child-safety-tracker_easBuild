import { scanFaces } from 'react-native-vision-camera';

export const detectFaces = async (imagePath) => {
  const result = await scanFaces(imagePath);
  return result.faces;
};