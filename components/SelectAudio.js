import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { removeRecording, setSelectedAudio } from '../store/audioSlice';
import * as DocumentPicker from 'expo-document-picker';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const SelectAudio = () => {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.audio.recordings);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const [currentPlayback, setCurrentPlayback] = useState(null);

  useEffect(() => {
    console.log("selectedAudio", selectedAudio);
  }, [selectedAudio]);

  const selectAudioFromPhone = async () => {
    try {
      const { assets } = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (assets) {
        console.log(`Fichier sélectionné : ${assets[0].name}`);
        dispatch(setSelectedAudio(assets[0]));
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'audio', error);
      Alert.alert('Erreur', `Échec de la sélection de l'audio : ${error.message}`);
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
    dispatch(setSelectedAudio(item));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => handleSelectAudio(item)} style={styles.textContainer}>
              <Text style={[styles.listItemText, selectedAudio === item.uri ? styles.selected : null]}>
                {item.name}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => playRecording(item.uri)}>
                <Icon name="play" size={24} color="blue" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecording(item.uri)}>
                <Icon name="trash" size={24} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <CustomButton title="Sélectionner audio du téléphone" onPress={selectAudioFromPhone} iconName="folder-open" />
      {selectedAudio && (
        <View style={styles.selectedContainer}>
          <Text>Sélectionné: {selectedAudio.name}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  textContainer: {
    flex: 1,
  },
  listItemText: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  selected: {
    backgroundColor: 'lightgray',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  selectedContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
});

export default SelectAudio;
