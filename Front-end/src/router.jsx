import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/logIn';
import SignupPage from './pages/signUp';


const router = createBrowserRouter([{
    path: '/',
    element: <HomePage />
    }, 
    {path: '/login',
    element: <LoginPage />
    },
    {path: '/signup',
    element: <SignupPage />
    },
    {
    path: '*',
    element: <div>404 Not Found</div>
    }]);
export default router;