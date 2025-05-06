import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://a41c312e0a706ebeab9adee3b197f66c@o4509276509634560.ingest.us.sentry.io/4509276510814208",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
