import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { setModels, setSelectedModel } from '../store/modelSlice';
import { addConvertedAudio } from '../store/audioSlice';
import CustomButton from '../components/CustomButton';

const ModelSelection = () => {
  const dispatch = useDispatch();
  const models = useSelector((state) => state.model.models); // Récupère les modèles depuis le store Redux
  const selectedModel = useSelector((state) => state.model.selectedModel); // Récupère le modèle sélectionné depuis le store Redux
  const selectedAudio = useSelector((state) => state.audio.selectedAudio); // Récupère l'audio sélectionné depuis le store Redux
  const convertedAudios = useSelector((state) => state.audio.convertedAudios); // Récupère les audios convertis depuis le store Redux
  const [currentPlayback, setCurrentPlayback] = useState(null); // État pour le lecteur audio actuel
  const [isLoading, setIsLoading] = useState(false); // État pour l'indicateur de chargement
  const [tempConvertedAudio, setTempConvertedAudio] = useState(null); // État pour l'audio converti temporaire
  const serverIP = useSelector((state) => state.server.serverIP); // Récupère l'IP du serveur depuis le store Redux
  const port = useSelector((state) => state.server.port); // Récupère le port du serveur depuis le store Redux

  useEffect(() => {
    fetchModels(); // Récupère les modèles à l'initialisation
  }, []);

  useEffect(() => {
    console.log("convertedAudios", convertedAudios);
  }, [convertedAudios]);

  // Récupération des modèles disponibles sur le serveur
  const fetchModels = async () => {
    try {
      const response = await axios.get(`http://${serverIP}:${port}/getmodels`);
      dispatch(setModels(response.data.models));
    } catch (error) {
      Alert.alert('Erreur lors de la récupération des modèles', error.message);
    }
  };

  // Sélection d'un modèle sur le serveur
  const selectModel = async (model) => {
    try {
      await axios.get(`http://${serverIP}:${port}/selectModel/${model}`);
      dispatch(setSelectedModel(model));
    } catch (error) {
      Alert.alert('Erreur lors de la sélection du modèle', error.message);
    }
  };

  // Transfert de l'audio vers le serveur
  const transferAudio = async () => {
    if (!selectedAudio) {
      Alert.alert('Aucun audio sélectionné');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: selectedAudio.uri,
        name: selectedAudio.name,
        type: "audio/wav",
      });

      const response = await fetch(`http://${serverIP}:${port}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Filename: selectedAudio.name,
        },
      });

      console.log("Réponse du serveur : ", response);
      
      await downloadConvertedAudio(); // Télécharge l'audio converti après le transfert
    } catch (error) {
      Alert.alert('Erreur lors du transfert de l\'audio', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Téléchargement de l'audio converti depuis le serveur
  const downloadConvertedAudio = async () => {
    const downloadUrl = `http://${serverIP}:${port}/download`;
    const directory = FileSystem.documentDirectory + "test";
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

    const { uri } = await FileSystem.downloadAsync(downloadUrl, `${directory}/hey.wav`);
    console.log(`Fichier téléchargé à : ${uri}`);
    setTempConvertedAudio(uri);
    Alert.alert('Téléchargement terminé', `Fichier téléchargé à ${uri}`);
  };

  // Lecture de l'audio
  const playAudio = async (uri) => {
    try {
      console.log(`Tentative de lecture du fichier : ${uri}`);
      if (currentPlayback) {
        await currentPlayback.stopAsync();
        setCurrentPlayback(null);
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync({ uri });
      setCurrentPlayback(sound);

      await sound.playAsync();
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'enregistrement', error);
      Alert.alert('Erreur', `Échec de la lecture de l'enregistrement : ${error.message}`);
    }
  };

  // Sauvegarde de l'audio converti
  const saveConvertedAudio = async () => {
    if (!tempConvertedAudio) {
      Alert.alert('Aucun audio converti disponible');
      return;
    }

    const newFileName = `${FileSystem.documentDirectory}converted_${Date.now()}.wav`;
    await FileSystem.moveAsync({
      from: tempConvertedAudio,
      to: newFileName,
    });
    dispatch(addConvertedAudio(newFileName));
    setTempConvertedAudio(null); // Réinitialiser l'audio temporaire après l'avoir sauvegardé
    Alert.alert('Audio sauvegardé', newFileName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélection du modèle</Text>
      <FlatList
        data={models}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectModel(item)}>
            <Text style={[styles.listItemText, item === selectedModel ? styles.selected : null]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <CustomButton title="Transférer l'audio" onPress={transferAudio} iconName="cloud-upload" />
      )}
      <View style={styles.buttonContainer}>
        {selectedAudio && <CustomButton title="Audio d'entrée" onPress={() => playAudio(selectedAudio.uri)} iconName="play" />}
        {tempConvertedAudio && <CustomButton title="Audio converti" onPress={() => playAudio(tempConvertedAudio)} iconName="play" />}
      </View>
      {tempConvertedAudio && <CustomButton title="Enregistrer l'audio converti" onPress={saveConvertedAudio} iconName="save" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  listItemText: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  selected: {
    backgroundColor: 'lightgray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default ModelSelection;
