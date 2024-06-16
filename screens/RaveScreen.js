import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RecordScreen from './RecordScreen';
import SelectAudio from '../components/SelectAudio';
import ModelSelection from '../components/ModelSelection';
import ConvertedAudios from '../components/ConvertedAudios';

const Tab = createMaterialTopTabNavigator();

const RaveScreen = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="SelectAudio">
        {() => <SelectAudio onSelectAudio={setSelectedAudio} />}
      </Tab.Screen>
      <Tab.Screen name="ModelSelection">
        {() => <ModelSelection selectedAudio={selectedAudio} />}
      </Tab.Screen>
      <Tab.Screen name="ConvertedAudios" component={ConvertedAudios} />
    </Tab.Navigator>
  );
};

export default RaveScreen;
