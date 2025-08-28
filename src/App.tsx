// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from './LandingPage.tsx';
import AuthFlowPage from './AuthFlowPage.tsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/auth",
      element: <AuthFlowPage />,
    },
  ],
  {
    // Возвращаем basename, чтобы роутер правильно работал на GitHub Pages
    basename: "/ui-antipatterns-museum/",
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;