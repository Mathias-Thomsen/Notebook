import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { database } from '../firebase';

export default function DetailScreen({ route, navigation }) {
  const { noteId, noteText } = route.params; // InitialNoteText omdøbt til noteText for enkelhed
  const [editedNoteText, setEditedNoteText] = useState(noteText);

  const saveEditedNote = async () => {
    try {
      await updateDoc(doc(database, "notes", noteId), { text: editedNoteText });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const deleteNote = async () => {
    try {
      await deleteDoc(doc(database, "notes", noteId));
      navigation.goBack();
    } catch (error) {
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
      <Button title="Save" onPress={saveEditedNote} />
      <Button title="Delete" onPress={deleteNote} />
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
