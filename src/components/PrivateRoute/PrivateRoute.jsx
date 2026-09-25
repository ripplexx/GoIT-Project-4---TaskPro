import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isLoggedIn, isRefreshing } = useAuth();

    if (isRefreshing) return null;
    return isLoggedIn ? children : <Navigate to="/welcome" replace />;
};

export default PrivateRoute;
