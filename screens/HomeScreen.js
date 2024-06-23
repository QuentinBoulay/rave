import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setServerIP, setPort } from '../store/serverSlice'; // Importez les actions
import axios from 'axios';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const serverIP = useSelector((state) => state.server.serverIP);
  const port = useSelector((state) => state.server.port);

  const connectToServer = async () => {
    try {
      const response = await axios.get(`http://${serverIP}:${port}`);
      if (response.status === 200) {
        navigation.navigate('Rave');
      } else {
        Alert.alert('Erreur', 'Mauvaise réponse du serveur. Veuillez vérifier les identifiants.');
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible de se connecter au serveur. Veuillez vérifier l'IP et le port.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Entrez l'IP du serveur</Text>
      <TextInput
        value={serverIP}
        onChangeText={(text) => dispatch(setServerIP(text))} // Utilisez l'action pour mettre à jour l'état
        placeholder="Entrez l'IP du serveur"
        style={styles.input}
      />
      <Text style={styles.label}>Entrez le port</Text>
      <TextInput
        value={port}
        onChangeText={(text) => dispatch(setPort(text))} // Utilisez l'action pour mettre à jour l'état
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
