import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initSupabase } from "@services/supabase";
import "@styles/global.scss";

// Initialize Supabase
try {
  initSupabase();
} catch (error) {
  console.error("Failed to initialize Supabase:", error);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
