import React, { useState } from 'react';
import { View, Button, TextInput, FlatList, StatusBar, StyleSheet, Text } from 'react-native';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { database } from '../firebase/firebaseConfig';
import useFirebase from '../firebase/useFirebase'; 

export default function HomeScreen({ navigation }) {
  const [text, setText] = useState('');
  const { addOrUpdateNoteWithImage } = useFirebase(); 
  const [values, loading, error] = useCollection(collection(database, "notes")); 
  
  const data = values?.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) || [];

  const handleAddNote = async () => {
    if (text.trim().length === 0) {
      alert('Note cannot be empty.');
      return;
    }
  
    try {
      await addOrUpdateNoteWithImage(text);
      setText(''); 
    } catch (error) {
      alert('An error occurred while adding the note.');
      console.error("Error adding document: ", error);
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.noteButtonContainer}>
      <Button
        title={item.text.substring(0, 30) + (item.text.length > 30 ? "..." : "")}
        onPress={() => navigation.navigate("DetailScreen", { noteId: item.id, noteText: item.text, noteImageUrl: item.imageUrl})}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      <TextInput
        style={styles.textInput}
        onChangeText={setText}
        value={text}
        placeholder="Type here to add a note..."
        multiline
        textAlignVertical="top"
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Note" onPress={handleAddNote} />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notesContainer}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F3',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  textInput: {
    borderColor: '#D1D1D6',
    borderWidth: 1,
    borderRadius: 25,
    width: '90%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  notesContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '90%',
  },
  noteButtonContainer: {
    marginBottom: 10,
  },
});