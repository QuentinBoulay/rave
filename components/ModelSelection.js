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
  const models = useSelector((state) => state.model.models);
  const selectedModel = useSelector((state) => state.model.selectedModel);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const convertedAudios = useSelector((state) => state.audio.convertedAudios);
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempConvertedAudio, setTempConvertedAudio] = useState(null); // État temporaire pour l'audio converti
  const serverIP = '172.20.10.4';
  const port = '8000';

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    console.log("convertedAudios", convertedAudios);
  }, [convertedAudios]);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`http://${serverIP}:${port}/getmodels`);
      dispatch(setModels(response.data.models));
    } catch (error) {
      Alert.alert('Erreur lors de la récupération des modèles', error.message);
    }
  };

  const selectModel = async (model) => {
    try {
      await axios.get(`http://${serverIP}:${port}/selectModel/${model}`);
      dispatch(setSelectedModel(model));
    } catch (error) {
      Alert.alert('Erreur lors de la sélection du modèle', error.message);
    }
  };

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

      await fetch(`http://${serverIP}:${port}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Filename: selectedAudio.name,
        },
      });

      await downloadConvertedAudio();
    } catch (error) {
      Alert.alert('Erreur lors du transfert de l\'audio', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadConvertedAudio = async () => {
    const downloadUrl = `http://${serverIP}:${port}/download`;
    const directory = FileSystem.documentDirectory + "test";
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

    const { uri } = await FileSystem.downloadAsync(downloadUrl, `${directory}/hey.wav`);
    setTempConvertedAudio(uri);
    Alert.alert('Téléchargement terminé', `Fichier téléchargé à ${uri}`);
  };

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
