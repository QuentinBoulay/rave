import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import { removeRecording, setSelectedAudio } from '../store/audioSlice';

const SelectAudio = () => {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.audio.recordings);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const [currentPlayback, setCurrentPlayback] = useState(null);


  const selectAudioFromPhone = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (result.type === 'success') {
      dispatch(setSelectedAudio(result.uri));
      playAudioFromUri(result.uri);
    }
  };

  async function playRecording(uri) {
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
  }

  const deleteRecording = (uri) => {
    dispatch(removeRecording(uri));
  };

  const handleSelectAudio = (item) => {
    dispatch(setSelectedAudio(item.name));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <TouchableOpacity onPress={() => handleSelectAudio(item)}>
              <Text style={{ padding: 10, backgroundColor: selectedAudio === `${FileSystem.documentDirectory}${item}` ? 'lightgray' : 'white' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playRecording(item.uri)}>
              <Text style={{ color: 'blue', marginHorizontal: 10 }}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteRecording(item.uri)}>
              <Text style={{ color: 'red', marginHorizontal: 10 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Sélectionner audio du téléphone" onPress={selectAudioFromPhone} />
      {selectedAudio && (
        <View style={{ flexDirection: 'row', marginVertical: 20 }}>
          <Text>Selected: {selectedAudio.split('/').pop()}</Text>
        </View>
      )}
    </View>
  );
};

export default SelectAudio;
