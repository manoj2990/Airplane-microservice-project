import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux';
;
import {persistor,store} from "./redux/Store.jsx"
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from "react-router-dom"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
      <App  />
      </PersistGate>
      </BrowserRouter>
      <Toaster/>
    </Provider>
  </StrictMode>,
)
