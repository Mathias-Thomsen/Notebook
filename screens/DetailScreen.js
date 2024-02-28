import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import useFirebase from '../firebase/useFirebase'; // Opdater stien efter behov

export default function DetailScreen({ route, navigation }) {
  const { noteId, noteText } = route.params;
  const [editedNoteText, setEditedNoteText] = useState(noteText);
  const { updateNote, deleteNote } = useFirebase(); // Brug updateNote og deleteNote fra useFirebase

  const handleSaveEditedNote = async () => {
    if (editedNoteText.trim().length === 0) {
      alert('Note text cannot be empty. Then use the delete button');
      return;
    }
  
    try {
      await updateNote(noteId, editedNoteText);
      navigation.goBack();
    } catch (error) {
      alert('An error occurred while saving the note.');
      console.error("Error updating document:", error);
    }
  };
  
  const handleDeleteNote = async () => {
    try {
      await deleteNote(noteId);
      navigation.goBack();
    } catch (error) {
      alert('An error occurred while deleting the note.');
      console.error("Error deleting document:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>Full Note:</Text>
      <TextInput
        style={styles.noteInput}
        multiline
        onChangeText={setEditedNoteText}
        value={editedNoteText}
      />
      <Button title="Save" onPress={handleSaveEditedNote} />
      <Button title="Delete" onPress={handleDeleteNote} />
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
