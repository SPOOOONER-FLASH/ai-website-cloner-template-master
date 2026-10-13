import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/standard.css";
import "./styles.css"; // read-only: the demo's body reset, so this page matches the other previews
import "./finder.css";
import { FinderPreview } from "./FinderPreview.jsx";

createRoot(document.getElementById("root")).render(<FinderPreview />);
