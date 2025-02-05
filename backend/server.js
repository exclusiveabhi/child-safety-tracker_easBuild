const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BusLocation = require('./models/BusLocation'); 
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const tf = require('@tensorflow/tfjs');
const faceapi = require('@tensorflow-models/face-landmarks-detection');
const { createCanvas, Image } = require('canvas');
const port = 3000;

app.use(morgan('dev'));
app.use(cors());
require('dotenv').config();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
mongoose.connect(`mongodb+srv://exclusiveabhi:maCdjaRpoWvGczS5@cluster0.vjj5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to convert base64 to Canvas Image
const base64ToImage = (base64) => {
  const buffer = Buffer.from(base64, 'base64');
  const img = new Image();
  img.src = buffer;
  return img;
};

// Function to detect faces using face-api.js
const detectFaces = async (img) => {
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const model = await faceapi.load(faceapi.SupportedPackages.mediapipeFacemesh);
  const predictions = await model.estimateFaces({
    input: canvas,
    returnTensors: false,
    flipHorizontal: false,
  });
  return predictions;
};

// Function to calculate Euclidean distance between two points
const euclideanDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
};

// Function to compare faces using face-api.js
const compareFaces = (face1, face2) => {
  const landmarks1 = face1.scaledMesh;
  const landmarks2 = face2.scaledMesh;

  if (landmarks1.length !== landmarks2.length) {
    return 0;
  }

  let totalDistance = 0;
  for (let i = 0; i < landmarks1.length; i++) {
    totalDistance += euclideanDistance(landmarks1[i], landmarks2[i]);
  }

  const averageDistance = totalDistance / landmarks1.length;
  const similarity = 1 / (1 + averageDistance); // Inverse of distance for similarity
  return similarity;
};

// API endpoint to scan face
app.post('/scan-face', async (req, res) => {
  const { image } = req.body;

  try {
    const students = await Student.find();
    const sourceImg = base64ToImage(image);
    const sourceFaces = await detectFaces(sourceImg);

    if (sourceFaces.length === 0) {
      return res.json({ success: false, message: 'No face detected' });
    }

    const sourceFace = sourceFaces[0];

    for (const student of students) {
      const targetImg = base64ToImage(student.photo);
      const targetFaces = await detectFaces(targetImg);

      if (targetFaces.length === 0) {
        continue;
      }

      const targetFace = targetFaces[0];
      const similarity = compareFaces(sourceFace, targetFace);

      if (similarity > 0.9) { // Adjust threshold as needed
        return res.json({ success: true, student });
      }
    }

    res.json({ success: false, message: 'Student not recognized' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error comparing faces', error });
  }
});

// API to send email
app.post('/send-email', async (req, res) => {
  const { email, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending email', error });
  }
});

// API to create or update bus location
app.post('/bus-location', async (req, res) => {
  const { busNumber, latitude, longitude } = req.body;

  try {
    let busLocation = await BusLocation.findOne({ busNumber });

    if (busLocation) {
      busLocation.latitude = latitude;
      busLocation.longitude = longitude;
      busLocation.timestamp = new Date();
      await busLocation.save();
      res.json({ message: 'Location updated', locationId: busLocation._id });
    } else {
      busLocation = new BusLocation({
        busNumber,
        latitude,
        longitude,
        timestamp: new Date()
      });
      await busLocation.save();
      res.json({ message: 'Location created', locationId: busLocation._id });
    }
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).send('Error updating location');
  }
});

// API to get bus location by bus number
app.get('/bus-location/:busNumber', async (req, res) => {
  const { busNumber } = req.params;
  const busLocation = await BusLocation.findOne({ busNumber }).sort({ timestamp: -1 });
  res.json(busLocation);
});

// Other API endpoints...

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});