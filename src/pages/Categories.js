import React, { useState, useEffect } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Tooltip,
  Zoom,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import toast, { Toaster } from "react-hot-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingName, setEditingName] = useState("");

  const theme = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await addCategory({ name: newCategoryName });
      setNewCategoryName("");
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error adding category: ", error);
      toast.error("Error adding category");
    }
  };

  const handleUpdateCategory = async (e, id) => {
    e.preventDefault();
    try {
      await updateCategory(id, { name: editingName });
      setEditingCategory(null);
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category: ", error);
      toast.error("Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast.error("Error deleting category");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Toaster />
      <Typography variant="h4" component="h1" gutterBottom>
        Categories
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box
          component="form"
          onSubmit={handleAddCategory}
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <TextField
            label="New Category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            fullWidth
          />
          <Tooltip title="Add Category">
            <IconButton
              type="submit"
              color="primary"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      <List>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <Zoom in>
              <Paper
                elevation={1}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <ListItem
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                  }}
                >
                  {editingCategory === category.id ? (
                    <Box
                      component="form"
                      onSubmit={(e) => handleUpdateCategory(e, category.id)}
                      sx={{ display: "flex", flexGrow: 1, gap: 2 }}
                    >
                      <TextField
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        required
                        fullWidth
                      />
                      <Tooltip title="Confirm">
                        <IconButton type="submit" color="primary">
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton
                          color="secondary"
                          onClick={() => setEditingCategory(null)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <ListItemText primary={category.name} />
                  )}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setEditingCategory(category.id);
                          setEditingName(category.name);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              </Paper>
            </Zoom>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Categories;
