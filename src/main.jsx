import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ContextProvider } from './Context/Auth.jsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router.jsx';
import { Provider } from 'react-redux';
import { persistor, StoreApp } from './Store/Store.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import './app.css';
createRoot(document.getElementById('root')).render(
  <Provider store={StoreApp}>
    <PersistGate loading={null} persistor={persistor}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </PersistGate>
  </Provider>
);

