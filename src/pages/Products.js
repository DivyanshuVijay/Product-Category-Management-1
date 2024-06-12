import React, { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import {
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { toast, Toaster } from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    rating: 1,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    category: "",
    rating: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);

        // Create a map of category IDs to category names
        const categoryMap = fetchedCategories.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCategoryMap(categoryMap);

        const products = await getProducts(
          filterCategory,
          sortRating,
          searchTerm
        );
        setProducts(products);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [filterCategory, sortRating, searchTerm]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
      setNewProduct({ name: "", category: "", rating: 1 });
      const updatedProducts = await getProducts(
        filterCategory,
        sortRating,
        searchTerm
      );
      setProducts(updatedProducts);
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error("Error adding product");
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      await updateProduct(id, editingData);
      setEditingProduct(null);
      setOpenDialog(false);
      const updatedProducts = await getProducts(
        filterCategory,
        sortRating,
        searchTerm
      );
      setProducts(updatedProducts);
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error("Error updating product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      const updatedProducts = await getProducts(
        filterCategory,
        sortRating,
        searchTerm
      );
      setProducts(updatedProducts);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error("Error deleting product");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const filteredProducts = await getProducts(
        filterCategory,
        sortRating,
        searchTerm
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error searching products: ", error);
    }
  };

  const renderRating = (rating) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <StarIcon key={index} sx={{ color: "yellow" }} />
          ) : (
            <StarBorderIcon key={index} sx={{ color: "grey" }} />
          )
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toaster />
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        <b>Products</b>
      </Typography>

      <Typography
        variant="h6"
        component="div"
        sx={{ mb: 1, color: "grey.600" }}
      >
        ADD NEW PRODUCT
      </Typography>
      <Box
        component="form"
        onSubmit={handleAddProduct}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
          gap: 2,
        }}
      >
        <TextField
          label="New Product"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          required
          fullWidth
        />
        <Select
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          displayEmpty
          required
          fullWidth
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
          value={newProduct.rating}
          onChange={(e) =>
            setNewProduct({ ...newProduct, rating: e.target.value })
          }
          inputProps={{ min: 1, max: 5 }}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Product
        </Button>
      </Box>
      <Typography
        variant="h6"
        component="div"
        sx={{ mb: 1, color: "grey.600" }}
      >
        SEARCH PRODUCTS
      </Typography>
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
      >
        <TextField
          label="Search Product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ height: "55px" }}
        >
          Search
        </Button>
      </Box>
      <Typography
        variant="h6"
        component="div"
        sx={{ mb: 1, color: "grey.600" }}
      >
        FILTER PRODUCTS BY CATEGORY
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Typography
        variant="h6"
        component="div"
        sx={{ mb: 1, color: "grey.600" }}
      >
        SORT PRODUCTS BY RATING
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Select
          value={sortRating}
          onChange={(e) => setSortRating(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Sort by Rating
          </MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </Box>
      <Box
        component="hr"
        sx={{
          border: "none",
          borderTop: "1px solid grey",
          mt: 2, // Top margin
          mb: 2, // Bottom margin
        }}
      />

      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info">No products found.</Alert>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card
                    sx={{
                      transition: "transform 0.5s, box-shadow 0.5s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="div"
                        sx={{ mb: 2 }}
                      >
                        {categoryMap[product.category]}
                      </Typography>
                      {renderRating(product.rating)}
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setEditingProduct(product);
                          setEditingData({
                            name: product.name,
                            category: product.category,
                            rating: product.rating,
                          });
                          setOpenDialog(true);
                        }}
                      >
                        <EditIcon sx={{ color: "primary.main" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <DeleteIcon sx={{ color: "error.main" }} />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the details of the product.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Product Name"
            type="text"
            fullWidth
            value={editingData.name}
            onChange={(e) =>
              setEditingData({ ...editingData, name: e.target.value })
            }
          />
          <Select
            fullWidth
            value={editingData.category}
            onChange={(e) =>
              setEditingData({ ...editingData, category: e.target.value })
            }
            displayEmpty
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
            margin="dense"
            label="Rating"
            type="number"
            fullWidth
            value={editingData.rating}
            onChange={(e) =>
              setEditingData({ ...editingData, rating: e.target.value })
            }
            inputProps={{ min: 1, max: 5 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateProduct(editingProduct.id)}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
