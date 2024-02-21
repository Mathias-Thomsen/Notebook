import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [text, setText] = useState('');
  const [notes, setNotes] = useState([]);

    useFocusEffect(
      React.useCallback(() => {
        const load = async () => {
          await loadNotes();
        };
        
        load();
      }, [])
    );

  async function saveNotes(notesToSave) {
    try {
      const jsonValue = JSON.stringify(notesToSave);
      await AsyncStorage.setItem('@myNotes', jsonValue);
    } catch (error) {
      console.error('Failed to save notes.', error);
    }
  }

  async function loadNotes() {
    try {
      const jsonValue = await AsyncStorage.getItem('@myNotes');
      if (jsonValue != null) {
        setNotes(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Failed to load notes.', error);
    }
  }

  const addNote = () => {
    if (text.trim()) {
      const newNote = { id: Date.now().toString(), text: text };
      const newNotes = [...notes, newNote];
      setNotes(newNotes);
      setText('');
      saveNotes(newNotes); 
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
        multiline={true}
        textAlignVertical="top" 
      />

      <View style={styles.buttonContainer}>
        <Button title="Add Note" onPress={addNote} />
        <View style={styles.buttonSpacer} />
        <Button title="Save Notes" onPress={saveNotes} />
        <View style={styles.buttonSpacer} />
        <Button title="Load Notes" onPress={loadNotes} />
      </View>
      <ScrollView style={styles.notesContainer}>
        {notes.map((note, index) => (
          <View key={note.id} style={styles.noteButtonContainer}>
            <Button
              title={note.text.substring(0, 30) + (note.text.length > 30 ? "..." : "")}
              onPress={() => goToDetailPage(note.id, note.text)}
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
    note: {
      padding: 15,
      marginTop: 10,
      
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around', 
      marginBottom: 20,
    },
    buttonSpacer: {
      width: 10, 
    },
    noteButtonContainer: {
      marginBottom: 10, 
    },
  });
