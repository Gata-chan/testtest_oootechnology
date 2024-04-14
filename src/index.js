import React from 'react';

import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import './index.scss';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';

import HeaderComponent from './pages/components/header/HeaderComponent.tsx';
import FooterComponent from './pages/components/footer/FooterComponent.tsx';
import IndexPage from './pages/users/index/IndexPage.tsx';
import ViewPage from './pages/users/view/ViewPage.tsx';
import CreatePage from './pages/users/create/CreatePage.tsx';
import UpdatePage from './pages/users/update/UpdatePage.tsx';

import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { apiSlice } from './pages/api/apiSlice.ts';




const router = createBrowserRouter([
  {
    path: "/myapp",
    element: <App />,
  },
  {
    path: "/user/index",
    element: <IndexPage />,
  },
  {
    path: `/user/view/:id`,
    element: <ViewPage />
  },
  {
    path:'/user/create',
    element: <CreatePage />
  },
  {
    path:'/user/update/:id',
    element: <UpdatePage />
  },
  {
    path: "*",
    element: <Navigate to="/myapp" replace />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <main>
        <HeaderComponent/>
        <RouterProvider router={router} />
        <FooterComponent/>
      </main>
    </ApiProvider>
  </React.StrictMode>
);

reportWebVitals();
