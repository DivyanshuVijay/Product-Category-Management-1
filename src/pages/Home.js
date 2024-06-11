import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import categoriesImage from "../assets/categories.png";
import productImage from "../assets/box.png";

const GlassCard = styled(Card)({
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "10px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  margin: "20px",
  color: "#ffffff",
});

const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "140px",
  color: "#ffffff",
});

const FullHeightBox = styled(Box)({
  height: "90vh",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "3rem",
});

const Home = () => {
  return (
    <FullHeightBox>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <GlassCard>
            <IconContainer>
              <img
                src={categoriesImage}
                alt="category"
                style={{
                  width: "80px",
                  marginTop: "50px",
                }}
              />
            </IconContainer>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                align="center"
              >
                Categories
              </Typography>
              <Box display="flex" justifyContent="center">
                <Button
                  component={Link}
                  to="/categories"
                  variant="contained"
                  color="primary"
                >
                  Manage Categories
                </Button>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <GlassCard>
            <IconContainer>
              <img
                src={productImage}
                alt="product"
                style={{
                  width: "80px",
                  marginTop: "50px",
                }}
              />
            </IconContainer>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                align="center"
              >
                Products
              </Typography>
              <Box display="flex" justifyContent="center">
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  color="primary"
                >
                  Manage Products
                </Button>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </FullHeightBox>
  );
};

export default Home;
