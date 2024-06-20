import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import RecordScreen from './RecordScreen';
import SelectAudio from '../components/SelectAudio';
import ModelSelection from '../components/ModelSelection';
import ConvertedAudios from '../components/ConvertedAudios';

const Tab = createMaterialTopTabNavigator();

const RaveScreen = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        showLabel: false
      }}
    >
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="microphone" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="SelectAudio"
        options={{
          tabBarIcon: ({ color }) => <Icon name="music" color={color} size={24} />,
        }}
      >
        {() => <SelectAudio onSelectAudio={setSelectedAudio} />}
      </Tab.Screen>
      <Tab.Screen
        name="ModelSelection"
        options={{
          tabBarIcon: ({ color }) => <Icon name="cogs" color={color} size={24} />,
        }}
      >
        {() => <ModelSelection selectedAudio={selectedAudio} />}
      </Tab.Screen>
      <Tab.Screen
        name="ConvertedAudios"
        component={ConvertedAudios}
        options={{
          tabBarIcon: ({ color }) => <Icon name="file-audio-o" color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default RaveScreen;
