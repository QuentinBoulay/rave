import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SelectAudio from '../components/SelectAudio';
import ModelSelection from '../components/ModelSelection';
import ConvertedAudios from '../components/ConvertedAudios';

const SubTab = createMaterialTopTabNavigator();

const SubTabNavigator = ({ selectedAudio, onSelectAudio }) => {
  return (
    <SubTab.Navigator>
      <SubTab.Screen name="SelectAudio">
        {() => <SelectAudio onSelectAudio={onSelectAudio} />}
      </SubTab.Screen>
      <SubTab.Screen name="ModelSelection">
        {() => <ModelSelection selectedAudio={selectedAudio} />}
      </SubTab.Screen>
      <SubTab.Screen name="ConvertedAudios" component={ConvertedAudios} />
    </SubTab.Navigator>
  );
};

export default SubTabNavigator;
