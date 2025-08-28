// src/pages/LandingPage.tsx
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Сборник неожиданных UI решений</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Выберите, что запустить:</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/auth')}
            className="w-full text-left p-4 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <span className="font-bold text-lg">Авторизация пользователя</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">Пройдите самый неудобный процесс входа.</p>
          </button>
          <div className="w-full text-left p-4 bg-gray-200 dark:bg-gray-700 rounded-lg opacity-50">
            <span className="font-bold text-lg">Калькулятор (скоро)</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">Посчитайте дважды два самым сложным способом.</p>
          </div>
        </div>
      </div>
    </div>
  );
}