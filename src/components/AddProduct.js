// src/components/AddProduct.js
import React, { useState, useEffect } from "react";
import { addProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { TextField, Button, Box, Select, MenuItem } from "@mui/material";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(1);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({ name, category, rating });
      setName("");
      setCategory("");
      setRating(1);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          Select Category
        </MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Rating"
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        inputProps={{ min: 1, max: 5 }}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Product
      </Button>
    </Box>
  );
};

export default AddProduct;
