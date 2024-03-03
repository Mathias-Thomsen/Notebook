import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import useFirebase from '../firebase/useFirebase'; 
import * as ImagePicker from 'expo-image-picker';

export default function DetailScreen({ route, navigation }) {
  const { noteId, noteText, noteImageUrl } = route.params; 
  const [editedNoteText, setEditedNoteText] = useState(noteText);
  const [imagePath, setImagePath] = useState(noteImageUrl); 
  const { addNoteWithImage, deleteNote } = useFirebase();

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      });
      if (!result.canceled) {
        setImagePath(result.assets[0].uri); 
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleSave = async () => {
    if (editedNoteText.trim()) {
      await addNoteWithImage(noteId, editedNoteText, imagePath);
      navigation.goBack();
    } else {
      alert('Note text cannot be empty.');
    }
  };

  const handleDeleteNote = async () => {
    await deleteNote(noteId);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.noteInput}
        multiline
        onChangeText={setEditedNoteText}
        value={editedNoteText}
      />
      {imagePath ? (
        <Image source={{ uri: imagePath }} style={{ width: 300, height: 300 }} />
      ) : (
        <Text>No Image Selected</Text>
      )}
      <Button title="Pick Image" onPress={handlePickImage} />
      <Button title="Save" onPress={handleSave} />
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
    height: 100,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
});
