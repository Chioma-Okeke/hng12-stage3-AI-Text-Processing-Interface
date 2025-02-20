import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const summarizerMeta = document.createElement('meta');
summarizerMeta.httpEquiv = 'origin-trial';
summarizerMeta.content = import.meta.env.VITE_SUMMARIZER_TOKEN;
document.head.append(summarizerMeta);

const translatorMeta = document.createElement('meta');
translatorMeta.httpEquiv = 'origin-trial';
translatorMeta.content = import.meta.env.VITE_TRANSLATOR_TOKEN;
document.head.append(translatorMeta);

const detectorMeta = document.createElement('meta');
detectorMeta.httpEquiv = 'origin-trial';
detectorMeta.content = import.meta.env.VITE_DETECTOR_TOKEN;
document.head.append(detectorMeta);

// Check for AI configuration availability
const checkAIConfiguration = () => {
  return (
    'summarizer' in window &&
    'translator' in window &&
    'detector' in window
  );
};

function NoAIConfigView() {
  return (
    <div>
      <h1>To access this, you will need to have Chrome's built-in AI configuration enabled.</h1>
      <p>Please ensure your browser is properly configured.</p>
    </div>
  );
}

function AppWithAI() {
  const [hasAIConfig, setHasAIConfig] = useState(false);

  useEffect(() => {
    if (checkAIConfiguration()) {
      setHasAIConfig(true);
    }
  }, []);

  if (!hasAIConfig) {
    return <NoAIConfigView />;
  }

  return <App />;
}

createRoot(document.getElementById("root")).render(<AppWithAI />);
