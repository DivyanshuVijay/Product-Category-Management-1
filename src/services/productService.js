import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-config";

const productCollection = collection(db, "products");

export const getProducts = async (filterCategory = "", sortRating = "") => {
  let q = productCollection;

  // Check if only filterCategory is provided
  if (filterCategory) {
    q = query(productCollection, where("category", "==", filterCategory));
  }
  // Check if only sortRating is provided
  else if (sortRating) {
    q = query(
      productCollection,
      orderBy("rating", sortRating === "asc" ? "asc" : "desc")
    );
  }

  const productSnapshot = await getDocs(q);
  return productSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (product) => {
  await addDoc(productCollection, product);
};

export const updateProduct = async (id, updatedProduct) => {
  const productDoc = doc(db, "products", id);
  await updateDoc(productDoc, updatedProduct);
};

export const deleteProduct = async (id) => {
  const productDoc = doc(db, "products", id);
  await deleteDoc(productDoc);
};
