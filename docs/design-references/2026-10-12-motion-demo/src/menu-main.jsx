import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/standard.css";
import "./styles.css";
import { MenuPreview } from "./MenuPreview.jsx";
import "./menu.css";

createRoot(document.getElementById("root")).render(<MenuPreview />);
