import { doc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database, storage } from './firebaseConfig';

const useFirebase = () => {
  const addOrUpdateNoteWithImage = async (noteId, text, imagePath) => {
    let imageUrl = null;
    if (imagePath) {
      imageUrl = await uploadImage(imagePath, `notes/${noteId || new Date().getTime()}.jpg`);
    }
  
    if (noteId) {
    
      await updateDoc(doc(database, "notes", noteId), { text, imageUrl });
    } else {
      
      await addDoc(collection(database, "notes"), { text, imageUrl });
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(database, "notes", noteId));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const uploadImage = async (imagePath, fileName) => {
    if (imagePath) {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const storageRef = ref(storage, fileName);
      try {
        await uploadBytes(storageRef, blob);
        console.log("Image uploaded...");
        return getDownloadURL(storageRef);
      } catch (error) {
        console.error("Upload failed", error);
        throw error;
      }
    } else {
      console.log("No image selected");
    }
  };

  const downloadImage = async (fileName) => {
    const storageRef = ref(storage, fileName);
    try {
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  };

  const deleteImage = async (fileName) => {
    const storageRef = ref(storage, fileName);
    try {
      await deleteObject(storageRef);
      console.log("Image deleted...");
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };

  return { addOrUpdateNoteWithImage, deleteNote, uploadImage, downloadImage, deleteImage };
};

export default useFirebase;
