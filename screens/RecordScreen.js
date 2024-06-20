import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useDispatch } from 'react-redux';
import { addRecording } from '../store/audioSlice';
import CustomButton from '../components/CustomButton';

const RecordScreen = () => {
  const [recording, setRecording] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    if (!permissionResponse) {
      requestPermission();
    }
  }, [permissionResponse]);

  async function startRecording() {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    setRecording(recording);
    setIsRecording(true);
  }

  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (!uri) throw new Error("URI is undefined");
    setIsRecording(false);
  }

  async function saveRecording() {
    if (!currentFileName.trim()) {
      Alert.alert('Erreur', 'Veuillez fournir un nom pour l\'enregistrement.');
      return;
    }
    const uri = recording.getURI();
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      const newPath = `${FileSystem.documentDirectory}${currentFileName}.m4a`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      dispatch(addRecording({ uri: newPath, name: currentFileName + ".m4a" }));
      setCurrentFileName('');
      setRecording(null);
      Alert.alert('Succès', 'Enregistrement sauvegardé avec succès.');
    }
  }

  async function deleteRecording() {
    setRecording(null);
    setCurrentFileName('');
    setIsRecording(false);
  }

  return (
    <View style={styles.container}>
      {isRecording ? (
        <CustomButton title="Arrêter l'enregistrement" onPress={stopRecording} iconName="stop" />
      ) : (
        <CustomButton title="Démarrer l'enregistrement" onPress={startRecording} iconName="microphone" />
      )}
      <TextInput
        value={currentFileName}
        onChangeText={setCurrentFileName}
        placeholder="Entrez le nom du fichier"
        style={styles.input}
      />
      <CustomButton title="Sauvegarder l'enregistrement" onPress={saveRecording} iconName="save" disabled={!recording} />
      {recording && <CustomButton title="Supprimer l'enregistrement" onPress={deleteRecording} iconName="trash" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
});

export default RecordScreen;
