import { createBrowserRouter } from 'react-router-dom';
import App from './App'; // Make sure App is imported
import HomePage from './pages/homePage';
import LoginPage from './pages/logIn';
import SignupPage from './pages/signUp';
import LandingPage from './pages/landingPage';
import BikesPage from './pages/bikes';
import AboutPage from './pages/about';
import CartPage from './pages/cart';

const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    {
        path: '/',
        element: <App />,  // Wrap routes with App
        children: [
            { path: 'landing', element: <LandingPage /> },
            {path: 'bikes', element: <BikesPage />},
            {path: "about", element: <AboutPage />},
            {path: "cart", element: <CartPage />},
        ]
    },
    {
        path: '*',
        element: <div>404 Not Found</div>
    }
]);

export default router;