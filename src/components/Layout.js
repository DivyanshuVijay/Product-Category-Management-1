import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <a href="/" style={{ textDecoration: "none" }}>
            <Typography variant="h6" sx={{ color: "white" }}>
              Product-Category Management App
            </Typography>
          </a>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
