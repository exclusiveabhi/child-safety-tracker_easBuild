import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Image } from 'react-native';
import { getStudentsByBusNumber } from '../services/api';

const StudentsList = ({ busNumber }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsByBusNumber(busNumber);
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, [busNumber]);

  const handleAttendance = async (studentId, status) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student._id === studentId ? { ...student, attendance: status } : student
      )
    );
    console.log(`Student ID: ${studentId}, Status: ${status}`);
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
                onPress={() => handleAttendance(student._id, 'Picked')}
                color={student.attendance === 'Picked' ? 'green' : 'blue'}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Dropped"
                onPress={() => handleAttendance(student._id, 'Dropped')}
                color={student.attendance === 'Dropped' ? 'green' : 'blue'}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Absent"
                onPress={() => handleAttendance(student._id, 'Absent')}
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
  container: {
    flex: 1,
    padding: 16,
  },
  studentCard: {
    padding: 25,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
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
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default StudentsList;