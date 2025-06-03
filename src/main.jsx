import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'swiper/css';                 // core Swiper styles
import 'swiper/css/navigation';     // navigation module styles (optional)
import 'swiper/css/pagination';     // pagination module styles (optional)


import './index.css'
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
