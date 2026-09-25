import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { isLoggedIn, isRefreshing } = useAuth();

    if (isRefreshing) return null;
    return !isLoggedIn ? children : <Navigate to="/home" replace />;
};

export default PublicRoute;
