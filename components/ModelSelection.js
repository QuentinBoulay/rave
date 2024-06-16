import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { setModels, setSelectedModel } from '../store/modelSlice';
import { addConvertedAudio } from '../store/audioSlice';

const ModelSelection = () => {
  const dispatch = useDispatch();
  const models = useSelector((state) => state.model.models);
  const selectedModel = useSelector((state) => state.model.selectedModel);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const [convertedAudio, setConvertedAudio] = useState(null);
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const serverIP = '172.20.10.6';
  const port = '8000';

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      console.log(serverIP)
      console.log(port)
      const response = await axios.get(`http://${serverIP}:${port}/getmodels`);
      console.log(response)
      dispatch(setModels(response.data.models));
    } catch (error) {
      Alert.alert('Error fetching models', error.message);
    }
  };

  const selectModel = async (model) => {
    try {
      await axios.get(`http://${serverIP}:${port}/selectModel/${model}`);
      dispatch(setSelectedModel(model));
    } catch (error) {
      Alert.alert('Error selecting model', error.message);
    }
  };

  const transferAudio = async () => {
    if (!selectedAudio) {
      Alert.alert('No audio selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedAudio,
        type: 'audio/wav',
        name: selectedAudio.split('/').pop(),
      });

      const response = await axios.post(`http://${serverIP}:${port}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setConvertedAudio(response.data.fileName);
    } catch (error) {
      Alert.alert('Error transferring audio', error.message);
    }
  };

  const playAudio = async (fileName) => {
    if (currentPlayback) {
      await currentPlayback.stopAsync();
      setCurrentPlayback(null);
    }
    const playback = new Audio.Sound();
    await playback.loadAsync({ uri: `${FileSystem.documentDirectory}${fileName}` });
    await playback.playAsync();
    setCurrentPlayback(playback);
  };

  const saveConvertedAudio = async () => {
    const audioFile = `${FileSystem.documentDirectory}${convertedAudio}`;
    const newFileName = `${FileSystem.documentDirectory}converted_${Date.now()}.wav`;
    await FileSystem.moveAsync({
      from: audioFile,
      to: newFileName,
    });
    dispatch(addConvertedAudio(newFileName));
    Alert.alert('Audio saved', newFileName);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Sélection du modèle</Text>
      <FlatList
        data={models}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectModel(item)}>
            <Text style={{ padding: 10, backgroundColor: item === selectedModel ? 'lightgray' : 'white' }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Transférer l'audio" onPress={transferAudio} />
      <View style={{ flexDirection: 'row', marginVertical: 20 }}>
        <Button title="Audio d'entrée" onPress={() => playAudio(selectedAudio.split('/').pop())} />
        <Button title="Audio converti" onPress={() => playAudio(convertedAudio)} />
      </View>
      <Button title="Enregistrer l'audio converti" onPress={saveConvertedAudio} />
    </View>
  );
};

export default ModelSelection;
