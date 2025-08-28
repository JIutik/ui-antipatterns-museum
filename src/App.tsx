// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from './LandingPage.tsx'; // Исправленный путь
import AuthFlowPage from './AuthFlowPage.tsx'; // Исправленный путь

// Этот basename нужно будет удалить перед финальной публикацией на GitHub Pages,
// но для локальной разработки он может быть полезен.
// Пока что оставим его пустым для простоты.
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
  ]
  // Убираем basename для упрощения локальной разработки
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;