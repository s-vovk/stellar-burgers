import { getUserState } from '@selectors';
import { Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { user, loading } = useSelector(getUserState);

  if (loading) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};
