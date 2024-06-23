import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import RecordScreen from './RecordScreen';
import SelectAudio from '../components/SelectAudio';
import ModelSelection from '../components/ModelSelection';
import ConvertedAudios from '../components/ConvertedAudios';

// Création du navigator pour les onglets en haut
const Tab = createMaterialTopTabNavigator();

const RaveScreen = () => {
  const [selectedAudio, setSelectedAudio] = useState(null); // État pour stocker l'audio sélectionné

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowIcon: true, // Affiche les icônes sur la barre d'onglets
        tabBarShowLabel: false, // Masque les labels sur la barre d'onglets
        tabBarStyle: {
          backgroundColor: '#fff', // Style de la barre d'onglets
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#6200ee', // Couleur de l'indicateur sous l'onglet actif
        },
        tabBarIcon: ({ color }) => { // Définition des icônes pour chaque onglet
          let iconName;

          // Sélection de l'icône en fonction du nom de la route
          if (route.name === 'Record') {
            iconName = 'microphone';
          } else if (route.name === 'SelectAudio') {
            iconName = 'music';
          } else if (route.name === 'ModelSelection') {
            iconName = 'cogs';
          } else if (route.name === 'ConvertedAudios') {
            iconName = 'file-audio-o';
          }

          return <Icon name={iconName} color={color} size={24} />; // Retourne l'icône avec la couleur appropriée
        },
      })}
    >
      {/* Définition des écrans pour chaque onglet */}
      <Tab.Screen
        name="Record"
        component={RecordScreen} // Composant pour l'écran d'enregistrement
      />
      <Tab.Screen
        name="SelectAudio"
      >
        {/* Utilisation d'une fonction pour passer la prop onSelectAudio */}
        {() => <SelectAudio onSelectAudio={setSelectedAudio} />}
      </Tab.Screen>
      <Tab.Screen
        name="ModelSelection"
      >
        {/* Utilisation d'une fonction pour passer la prop selectedAudio */}
        {() => <ModelSelection selectedAudio={selectedAudio} />}
      </Tab.Screen>
      <Tab.Screen
        name="ConvertedAudios"
        component={ConvertedAudios} // Composant pour l'écran des audios convertis
      />
    </Tab.Navigator>
  );
};

export default RaveScreen;
