import { doc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database, storage } from './firebaseConfig';

const useFirebase = () => {
  const addOrUpdateNoteWithImage = async (noteId, text, newPaths) => {
    let imageUrls = [];
    if (newPaths && newPaths.length > 0) {
      // Sikrer, at vi kun behandler strenge i newPaths
      const uploadPromises = newPaths.map(path => {
        if (typeof path === 'string') {
          const fileNameSuffix = path.substring(path.lastIndexOf('/') + 1);
          const fileName = `notes/${noteId || new Date().getTime()}/${fileNameSuffix}`;
          return uploadImage(path, fileName);
        } else {
          return Promise.resolve(null); // Returner null for ikke-strenge paths
        }
      });
      imageUrls = (await Promise.all(uploadPromises)).filter(url => url != null);
    }
  
    if (noteId) {
      // Opdater den eksisterende note med ny tekst og/eller billede URL'er
      await updateDoc(doc(database, "notes", noteId), { text, imageUrls });
    } else {
      // Tilføj en ny note, hvis ingen noteId er givet
      await addDoc(collection(database, "notes"), { text, imageUrls });
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
        const downloadUrl = await getDownloadURL(storageRef);
        console.log("Image uploaded:", downloadUrl);
        return downloadUrl;
      } catch (error) {
        console.error("Upload failed", error);
        throw error;
      }
    } else {
      console.log("No image selected");
      return null;
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

  const deleteNoteImages = async (imageUrls) => {
    const deletePromises = imageUrls.map(url => {
      const fileName = url.split('/').pop(); // Antager at URL'en ender med filnavnet
      const storageRef = ref(storage, `notes/${fileName}`);
      return deleteObject(storageRef);
    });
    await Promise.all(deletePromises);
  };

  const deleteImage = async (downloadURL) => {
    const decodedURL = decodeURIComponent(downloadURL);
    const pathStart = decodedURL.indexOf('/o/') + 3;
    const pathEnd = decodedURL.indexOf('?');
    const objectPath = decodedURL.slice(pathStart, pathEnd);
    const storageRef = ref(storage, objectPath);
    try {
      await deleteObject(storageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  

  return { addOrUpdateNoteWithImage, deleteNote, uploadImage, downloadImage, deleteNoteImages , deleteImage};
};

export default useFirebase;
