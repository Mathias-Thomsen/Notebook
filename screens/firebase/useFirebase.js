import { doc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { database } from './firebaseConfig';

const useFirebase = () => {
  const addNote = async (text) => {
    if (text.trim()) {
      try {
        await addDoc(collection(database, "notes"), { text });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const updateNote = async (noteId, text) => {
    try {
      await updateDoc(doc(database, "notes", noteId), { text });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(database, "notes", noteId));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return { addNote, updateNote, deleteNote };
};

export default useFirebase;
