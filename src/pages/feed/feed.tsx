import { getOrdersState } from '@selectors';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../services/slices/ordersSlice';
import { AppDispatch } from 'src/services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector(getOrdersState);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  const onRefresh = () => {
    dispatch(getOrders());
  };

  if (!orders.length || loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={onRefresh} />;
};
