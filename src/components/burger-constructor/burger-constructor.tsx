import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { getConstructorItems } from '@selectors';
import { useNavigate } from 'react-router-dom';
import { getUserState } from '../../services/slices/userSlice';
import { AppDispatch } from 'src/services/store';
import {
  orderBurger,
  resetLastOrder
} from '../../services/slices/constructorItemsSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const constructorItems = useSelector(getConstructorItems);
  const { user } = useSelector(getUserState);
  const { orderRequest, lastOrder: orderModalData } = constructorItems;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    const orderData = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );

    const bun = constructorItems.bun;

    if (bun) {
      orderData.push(bun._id);
      orderData.push(bun._id);
    }

    dispatch(orderBurger(orderData));
  };

  const closeOrderModal = () => {
    dispatch(resetLastOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
