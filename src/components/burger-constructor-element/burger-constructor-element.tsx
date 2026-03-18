import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import {
  moveItemDown,
  moveItemUp,
  removeItem
} from '../../services/slices/constructorItemsSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleMoveDown = () => {
      dispatch(moveItemDown(ingredient.id));
    };

    const handleMoveUp = () => {
      dispatch(moveItemUp(ingredient.id));
    };

    const handleRemove = () => {
      dispatch(removeItem(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleRemove}
      />
    );
  }
);
