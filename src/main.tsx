import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./routes/AppRouter.tsx";
import "./styles/gacha-animations.css";

// PWA Service Worker registration (only in production)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(<AppRouter />);
