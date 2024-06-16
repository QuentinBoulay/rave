import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = () => {
  const [serverIP, setServerIP] = useState('172.20.10.6');
  const [port, setPort] = useState('8000');
  const navigation = useNavigation();

  const connectToServer = async () => {
    try {
      const response = await axios.get(`http://${serverIP}:${port}`);

      if (response.status === 200) {
        console.log('ok')
        navigation.navigate('Rave');
      } else {
        console.log("nok")
      }
    } catch (error) {
      console.log("nok")
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Enter server IP</Text>
      <TextInput
        value={serverIP}
        onChangeText={setServerIP}
        placeholder="Enter server IP"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Text>Enter port</Text>
      <TextInput
        value={port}
        onChangeText={setPort}
        placeholder="Enter port"
        keyboardType="numeric"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Button title="CONNECT" onPress={connectToServer} />
    </View>
  );
};

export default HomeScreen;
