import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { addRecording, removeRecording } from '../store/audioSlice';
import { useDispatch, useSelector } from 'react-redux';

const RecordScreen = () => {
  const [recording, setRecording] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const recordings = useSelector((state) => state.audio.recordings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!permissionResponse) {
      requestPermission();
    }
  }, [permissionResponse]);

  async function startRecording() {
    try {
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
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording.');
    }
  }

  useEffect(() => {
    return currentPlayback
      ? () => {
          console.log('Unloading Sound...');
          currentPlayback.unloadAsync();
        }
      : undefined;
  }, [currentPlayback]);

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      if (!uri) throw new Error("URI is undefined");

      const newRecording = {
        uri,
        name: currentFileName || `Recording ${recordings.length + 1}`,
      };
      console.log('New Recording:', newRecording);
      console.log(recordings)
      dispatch(addRecording(newRecording));
      setRecording(null);
      setCurrentFileName('');
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  const handleRecordButtonPress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title={isRecording ? 'Stop Recording' : 'Start Recording'} onPress={handleRecordButtonPress} />
      <TextInput
        value={currentFileName}
        onChangeText={setCurrentFileName}
        placeholder="Enter file name"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 20 }}
      />
    </View>
  );
};

export default RecordScreen;
