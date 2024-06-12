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

export const getProducts = async (
  filterCategory = "",
  sortRating = "",
  searchTerm = ""
) => {
  let constraints = [];

  if (filterCategory) {
    constraints.push(where("category", "==", filterCategory));
  }

  let q = constraints.length
    ? query(productCollection, ...constraints)
    : productCollection;

  const productSnapshot = await getDocs(q);
  let products = productSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Filter products by searchTerm if provided
  if (searchTerm) {
    products = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort products by rating if provided
  if (sortRating) {
    products.sort((a, b) => {
      if (sortRating === "asc") {
        return a.rating - b.rating;
      } else {
        return b.rating - a.rating;
      }
    });
  }

  return products;
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
