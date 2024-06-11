// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
