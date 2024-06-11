import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-config";

const categoryCollection = collection(db, "category");

export const getCategories = async () => {
  const categorySnapshot = await getDocs(categoryCollection);
  return categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addCategory = async (category) => {
  await addDoc(categoryCollection, category);
};

export const updateCategory = async (id, updatedCategory) => {
  const categoryDoc = doc(db, "category", id); // corrected collection name
  await updateDoc(categoryDoc, updatedCategory);
};

export const deleteCategory = async (id) => {
  const categoryDoc = doc(db, "category", id); // corrected collection name
  await deleteDoc(categoryDoc);
};
