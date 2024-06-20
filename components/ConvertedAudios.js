import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { removeConvertedAudio } from '../store/audioSlice';
import Icon from 'react-native-vector-icons/FontAwesome';

const ConvertedAudios = () => {
  const dispatch = useDispatch();
  const convertedAudios = useSelector((state) => state.audio.convertedAudios);
  const [currentPlayback, setCurrentPlayback] = useState(null);

  useEffect(() => {
    console.log("convertedAudios", convertedAudios)
  }, [convertedAudios])

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
      console.error('Erreur lors de la lecture de l\'audio converti', error);
      Alert.alert('Erreur', `Échec de la lecture de l'audio converti : ${error.message}`);
    }
  };

  const deleteAudio = async (uri) => {
    try {
      await FileSystem.deleteAsync(uri);
      dispatch(removeConvertedAudio(uri));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'audio converti', error);
      Alert.alert('Erreur', `Échec de la suppression de l'audio converti : ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audios convertis enregistrés</Text>
      <FlatList
        data={convertedAudios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.split('/').pop()}</Text>
            <TouchableOpacity onPress={() => playAudio(item)}>
              <Icon name="play" size={24} color="blue" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteAudio(item)}>
              <Icon name="trash" size={24} color="red" style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      />
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  listItemText: {
    flex: 1,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ConvertedAudios;
