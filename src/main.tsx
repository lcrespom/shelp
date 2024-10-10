import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { listen } from "@tauri-apps/api/event";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

listen<string>("tash-command", (event) => {
  console.log("Got event:", event);
});
console.log("Listening to tash-command events");
