import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "react-datepicker/dist/react-datepicker.css";
import "./css/index.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
);
