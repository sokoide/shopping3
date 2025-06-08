import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setupTelemetry } from './src/setupTelemetry'; // setupTelemetry をインポート

// アプリケーション初期化時に Telemetry をセットアップ
await setupTelemetry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);