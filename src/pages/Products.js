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
  Fade,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { toast, Toaster } from "react-hot-toast";
import { styled } from "@mui/system";

const ExpandableCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);

        // Create a map of category IDs to category names
        const categoryMap = fetchedCategories.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCategoryMap(categoryMap);

        // Fetch products based on filter, sort, and search parameters
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filterCategory, sortRating, searchTerm]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
      setNewProduct({ name: "", category: "", rating: 1 });
      await fetchProducts();
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error("Error adding product");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, editingData);
        setEditingProduct(null);
        setOpenDialog(false);
        await fetchProducts();
        toast.success("Product updated successfully!");
      } else {
        toast.error("No product selected for update");
      }
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error("Error updating product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error("Error deleting product");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchProducts();
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
          <MenuItem value="asc">Rating : Low to High</MenuItem>
          <MenuItem value="desc">Rating : High to Low</MenuItem>
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
        <CircularProgress />
      ) : products.length === 0 ? (
        <Fade in={true}>
          <Alert severity="info">No products found.</Alert>
        </Fade>
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
                  <IconButton onClick={() => handleDeleteProduct(product.id)}>
                    <DeleteIcon sx={{ color: "error.main" }} />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the product details as needed.
          </DialogContentText>
          <br />
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Product Name"
              value={editingData.name}
              onChange={(e) =>
                setEditingData({ ...editingData, name: e.target.value })
              }
              required
              fullWidth
            />
            <Select
              value={editingData.category}
              onChange={(e) =>
                setEditingData({ ...editingData, category: e.target.value })
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
              value={editingData.rating}
              onChange={(e) =>
                setEditingData({ ...editingData, rating: e.target.value })
              }
              inputProps={{ min: 1, max: 5 }}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateProduct(editingProduct)}
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
