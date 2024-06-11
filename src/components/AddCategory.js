// src/components/AddCategory.js
import React, { useState } from "react";
import { addCategory } from "../services/categoryService";
import { TextField, Button, Box } from "@mui/material";

const AddCategory = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory({ name });
      setName("");
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Category
      </Button>
    </Box>
  );
};

export default AddCategory;
