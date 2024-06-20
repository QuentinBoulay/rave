import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = () => {
  const [serverIP, setServerIP] = useState('172.20.10.6');
  const [port, setPort] = useState('8000');
  const navigation = useNavigation();

  const connectToServer = async () => {
    try {
      const response = await axios.get(`http://${serverIP}:${port}`);

      if (response.status === 200) {
        console.log('ok');
        navigation.navigate('Rave');
      } else {
        console.log("nok");
      }
    } catch (error) {
      console.log("nok");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Entrez l'IP du serveur</Text>
      <TextInput
        value={serverIP}
        onChangeText={setServerIP}
        placeholder="Entrez l'IP du serveur"
        style={styles.input}
      />
      <Text style={styles.label}>Entrez le port</Text>
      <TextInput
        value={port}
        onChangeText={setPort}
        placeholder="Entrez le port"
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={connectToServer}>
        <Text style={styles.buttonText}>CONNECTER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
