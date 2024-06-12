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
  let q = productCollection;

  // Build the query based on provided parameters
  if (filterCategory && sortRating) {
    q = query(
      productCollection,
      where("category", "==", filterCategory),
      orderBy("rating", sortRating === "asc" ? "asc" : "desc")
    );
  } else if (filterCategory) {
    q = query(productCollection, where("category", "==", filterCategory));
  } else if (sortRating) {
    q = query(
      productCollection,
      orderBy("rating", sortRating === "asc" ? "asc" : "desc")
    );
  }

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
