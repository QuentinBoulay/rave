import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Composant bouton personnalisé
const CustomButton = ({ onPress, title, iconName, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.buttonDisabled : null]}
      onPress={onPress}
      disabled={disabled} // Désactive le bouton si nécessaire
    >
      {iconName && <Icon name={iconName} size={20} color="#fff" style={styles.icon} />} // Affiche l'icône si elle est définie
      <Text style={styles.buttonText}>{title}</Text> // Affiche le texte du bouton
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
});

export default CustomButton;
