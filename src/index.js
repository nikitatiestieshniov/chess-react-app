import React from "react";
import { createRoot } from "react-dom/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import App from "./components/App";


const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
  </React.StrictMode>,
);
