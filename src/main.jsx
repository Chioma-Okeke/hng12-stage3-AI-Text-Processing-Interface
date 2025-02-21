import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// const summarizerMeta = document.createElement('meta')
// summarizerMeta.httpEquiv = 'origin-trial'
// summarizerMeta.content = import.meta.env.VITE_SUMMARIZER_TOKEN
// document.head.append(summarizerMeta)

// const translatorMeta = document.createElement('meta')
// translatorMeta.httpEquiv = 'origin-trial'
// translatorMeta.content = import.meta.env.VITE_TRANSLATOR_TOKEN
// document.head.append(translatorMeta)

// const detectorMeta = document.createElement('meta')
// detectorMeta.httpEquiv = 'origin-trial'
// detectorMeta.content = import.meta.env.VITE_DETECTOR_TOKEN
// document.head.append(detectorMeta)


createRoot(document.getElementById("root")).render(<App />);
