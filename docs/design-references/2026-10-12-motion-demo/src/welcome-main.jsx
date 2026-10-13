import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/standard.css";
import "lenis/dist/lenis.css";
import "./welcome.css";
import { WelcomePreview } from "./WelcomePreview.jsx";

createRoot(document.getElementById("root")).render(<WelcomePreview />);
