  import React, { useState } from 'react';
  import { View, Text, TextInput, Button, StyleSheet, Image, FlatList, TouchableWithoutFeedback, Alert } from 'react-native';
  import useFirebase from '../firebase/useFirebase'; 
  import * as ImagePicker from 'expo-image-picker';

  export default function DetailScreen({ route, navigation }) {
    const { noteId, noteText, imageUrls } = route.params; 
    const [editedNoteText, setEditedNoteText] = useState(noteText);
    const [imagePaths, setImagePaths] = useState(imageUrls || []);
    const { addOrUpdateNoteWithImage, deleteNote, deleteImage } = useFirebase();

    

    const handlePickImage = async () => {
      try {
        // Antager en fiktiv metode til at vælge flere billeder
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          allowsMultipleSelection: true, 
        });
        if (!result.canceled) {
         
          const newImagePaths = result.assets.map(asset => asset.uri);
          setImagePaths([...imagePaths, ...newImagePaths]);
        }
      } catch (error) {
        console.error("Error picking images:", error);
      }
    };

 
    const handleSave = async () => {
      if (editedNoteText.trim()) {
        // Bestem hvilke nye stier, der skal uploades
        let newImagePaths = imagePaths;
        if (imagePaths) {
          newImagePaths = imagePaths.includes(imageUrls) ? imagePaths : [imageUrls, ...imagePaths];
        }
    
        await addOrUpdateNoteWithImage(noteId, editedNoteText, newImagePaths);
        navigation.goBack();
      } else {
        alert('Note text cannot be empty.');
      }
    };

    const handleDeleteNote = async () => {
      await deleteNote(noteId);
      navigation.goBack();
    };

    const handleDeleteImage = async (imageUrl) => {
      try {
        await deleteImage(imageUrl); // Funktionen til at slette billedet fra Firebase Storage
        // Opdaterer state og/eller Firestore for at fjerne billedets URL fra listen
        const updatedImagePaths = imagePaths.filter(path => path !== imageUrl);
        setImagePaths(updatedImagePaths);
        await addOrUpdateNoteWithImage(noteId, editedNoteText, updatedImagePaths);
      } catch (error) {
        console.error("Error deleting image:", error);
        Alert.alert("Error", "Failed to delete image.");
      }
    };

    const renderImage = ({ item }) => {
      // Lang tryk handler
      const handleLongPress = () => {
        Alert.alert(
          "Delete Image",
          "Are you sure you want to delete this image?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => handleDeleteImage(item) },
          ],
          { cancelable: true }
        );
      };
    
      return (
        <TouchableWithoutFeedback onLongPress={handleLongPress}>
          <Image source={{ uri: item }} style={{ width: 100, height: 100, marginRight: 10 }} />
        </TouchableWithoutFeedback>
      );
    };

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.noteInput}
          multiline
          onChangeText={setEditedNoteText}
          value={editedNoteText}
        />
        <FlatList
          data={imagePaths}
          renderItem={renderImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true} // Gør listen horisontal
        />
        <Button title="Take or Pick Images" onPress={handlePickImage} />
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
