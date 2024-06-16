import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { removeConvertedAudio } from '../store/audioSlice';

const ConvertedAudios = () => {
  const dispatch = useDispatch();
  const convertedAudios = useSelector((state) => state.audio.convertedAudios);
  const [currentPlayback, setCurrentPlayback] = useState(null);

  const playAudio = async (fileName) => {
    if (currentPlayback) {
      await currentPlayback.stopAsync();
      setCurrentPlayback(null);
    }
    const playback = new Audio.Sound();
    await playback.loadAsync({ uri: fileName });
    await playback.playAsync();
    setCurrentPlayback(playback);
  };

  const deleteAudio = async (fileName) => {
    await FileSystem.deleteAsync(fileName);
    dispatch(removeConvertedAudio(fileName));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Audios convertis enregistrés</Text>
      <FlatList
        data={convertedAudios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <Text style={{ flex: 1 }}>{item.split('/').pop()}</Text>
            <TouchableOpacity onPress={() => playAudio(item)}>
              <Text style={{ color: 'blue', marginHorizontal: 10 }}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteAudio(item)}>
              <Text style={{ color: 'red', marginHorizontal: 10 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ConvertedAudios;
