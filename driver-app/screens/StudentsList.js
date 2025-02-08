import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { DEVICE_IP } from '@env';
// console.log(DEVICE_IP);

const StudentsList = ({ busNumber }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log(`Fetching students for bus number: ${busNumber}`);
        const response = await axios.get(`${DEVICE_IP}/students/${busNumber}`);
        console.log('Fetched students:', response.data);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [busNumber]);

  const handleAttendance = async (studentId, status, email) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student._id === studentId ? { ...student, attendance: status } : student
      )
    );
    console.log(`Student ID: ${studentId}, Status: ${status}`);
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate); // "17-6-2022"

    try {
      await axios.post(`${DEVICE_IP}/send-email`, {
        email: email,
        subject: `Attendance Update for Your Child`,
        text: `Dear Parent/Guardian,

We would like to inform you about your child’s attendance status for ${currentDate}.:

Status: ${status}

Attendance plays a crucial role in their academic journey, and we encourage regular updates. If you have any questions or need to share details regarding this, please feel free to reach out.

Thank you for your continued support.

Best regards
Guradian Sync Team`,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {students.map(student => (
        <View key={student._id} style={styles.studentCard}>
          <Image source={{ uri: student.photo }} style={styles.photo} />
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.class}>{student.class}</Text>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button
                title="Picked"
                onPress={() => handleAttendance(student._id, 'Picked', student.email)}
                color={student.attendance === 'Picked' ? 'green' : 'blue'}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Dropped"
                onPress={() => handleAttendance(student._id, 'Dropped', student.email)}
                color={student.attendance === 'Dropped' ? 'green' : 'blue'}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Absent"
                onPress={() => handleAttendance(student._id, 'Absent', student.email)}
                color={student.attendance === 'Absent' ? 'red' : 'blue'}
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  studentCard: {
    padding: 25,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center', // Center the content horizontally
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  class: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure buttons take full width
  },
  button: {
    flex: 1,
    marginHorizontal: 5, // Add gap between buttons
  },
});

export default StudentsList;