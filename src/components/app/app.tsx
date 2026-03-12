import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
  OrderInfoModal,
  OrderInfo,
  IngredientDetails,
  IngredientDetailsModal
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, ProtectedRoute } from '@components';
import { Preloader } from '@ui';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getIngredients,
  getIngredientsState
} from '../../services/slices/ingredientsSlice';
import { AppDispatch } from 'src/services/store';
import { getOrders } from '../../services/slices/ordersSlice';
import { getUser } from '../../services/slices/userSlice';

const AppLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    ingredients,
    loading: isIngredientsLoading,
    error
  } = useSelector(getIngredientsState);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <Outlet />
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </div>
  );
};

export const App = () => {
  const location = useLocation();
  const { background } = location.state ?? {};

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<AppLayout />}>
          <Route path='*' element={<NotFound404 />} />
          <Route index element={<ConstructorPage />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/profile' element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/profile/orders' element={<ProtectedRoute />}>
            <Route path='/profile/orders' element={<ProfileOrders />} />
          </Route>
          <Route path='/profile/orders/:number' element={<ProtectedRoute />}>
            <Route path='/profile/orders/:number' element={<OrderInfo />} />
          </Route>
        </Route>
      </Routes>

      {background ? (
        <Routes>
          <Route path='/feed/:number' element={<OrderInfoModal />} />
          <Route path='/ingredients/:id' element={<IngredientDetailsModal />} />
          <Route path='/profile/orders/:number' element={<OrderInfoModal />} />
        </Routes>
      ) : null}
    </>
  );
};
