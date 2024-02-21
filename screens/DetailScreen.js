import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen({ route, navigation }) {
  const { noteId, noteText: initialNoteText } = route.params;
  const [noteText, setNoteText] = useState(initialNoteText);

  const saveEditedNote = async () => {
    const storedNotes = await AsyncStorage.getItem('@myNotes');
    let notes = storedNotes ? JSON.parse(storedNotes) : [];

    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { ...note, text: noteText };
      }
      return note;
    });

    try {
      await AsyncStorage.setItem('@myNotes', JSON.stringify(updatedNotes));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save the edited note.', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Full Note:</Text>
      <TextInput
        style={styles.noteInput}
        multiline={true}
        onChangeText={setNoteText}
        value={noteText}
      />
      <Button title="GEM" onPress={saveEditedNote} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noteInput: {
    height: 200,
    width: '90%', 
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    textAlignVertical: 'top', 
  },
});
