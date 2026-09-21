import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";
import { ProductProvider } from "./context/ProductContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
