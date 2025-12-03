import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import ErrorBoundary from "./components/error/ErrorBoundary.tsx";

// Inject Vercel Speed Insights
injectSpeedInsights();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ErrorBoundary>
  </StrictMode>
);
