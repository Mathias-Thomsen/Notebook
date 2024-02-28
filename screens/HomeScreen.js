import React, { useState } from 'react';
import { View, Button, TextInput, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { database } from '../firebase';

export default function HomeScreen({ navigation }) {
  const [text, setText] = useState('');
  const [values] = useCollection(collection(database, "notes"));
  const data = values?.docs.map(doc => ({
    ...doc.data(), 
    id: doc.id
  })) || [];

  const addNote = async () => {
    if (text.trim()) {
      try {
        await addDoc(collection(database, "notes"), { text });
        setText(''); // Reset text input after adding a note
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  function goToDetailPage(noteId, noteText) {
    navigation.navigate("DetailPage", { noteId, noteText });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={setText}
        value={text}
        placeholder="Type here to add a note..."
        multiline
        textAlignVertical="top"
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Note" onPress={addNote} />
      </View>
      <ScrollView style={styles.notesContainer}>
        {data.map(({ id, text }) => (
          <View key={id} style={styles.noteButtonContainer}>
            <Button
              title={text.substring(0, 30) + (text.length > 30 ? "..." : "")}
              onPress={() => goToDetailPage(id, text)}
            />
          </View>
        ))}
      </ScrollView>
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
    width: '90%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  noteButtonContainer: {
    marginBottom: 10,
  },
});
