import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/standard.css";
import "./styles.css";
import { App } from "./App.jsx";
import { GuidePage, ProductPage } from "./Inner.jsx";

// Three previews in one file: #/ homepage, #/product, #/guide. Plain in-page anchors (#ordering)
// leave the route alone.
const routeOf = (h) => (h.startsWith("#/product") ? "product" : h.startsWith("#/guide") ? "guide" : "home");

function Root() {
  const [route, setRoute] = useState(() => routeOf(location.hash));
  useEffect(() => {
    const on = () => { if (location.hash === "" || location.hash.startsWith("#/")) { setRoute(routeOf(location.hash)); window.scrollTo(0, 0); } };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return (
    <>
      {route === "home" ? <App /> : route === "product" ? <ProductPage /> : <GuidePage />}
      <nav className="switcher" aria-label="预览页面">
        {[["home", "#/", "首页"], ["product", "#/product", "产品页"], ["guide", "#/guide", "指南页"]].map(([k, href, label]) => (
          <a key={k} href={href} className={route === k ? "on" : ""}>{label}</a>
        ))}
      </nav>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
