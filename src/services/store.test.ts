import { rootReducer } from './store';
import { configureStore } from '@reduxjs/toolkit';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as constructorItemInitialState } from './slices/constructorItemsSlice';
import { initialState as ingredientsInitialState } from './slices/ingredientsSlice';
import { initialState as ordersInitialState } from './slices/ordersSlice';

const INITIAL_STATE = {
  constructorItems: constructorItemInitialState,
  ingredients: ingredientsInitialState,
  orders: ordersInitialState,
  user: userInitialState
};

describe('rootReducer', () => {
  it('should return the correct initial state', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toEqual(INITIAL_STATE);
  });

  it('should return initial state for unknown action', () => {
    const store = configureStore({ reducer: rootReducer });

    store.dispatch({ type: 'UNKNOWN_ACTION' });
    expect(store.getState()).toEqual(INITIAL_STATE);
  });

  it('should have all expected reducers', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toHaveProperty('constructorItems');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');

    expect(Object.keys(state)).toHaveLength(Object.keys(INITIAL_STATE).length);
  });

  it('should handle re-initialization correctly', () => {
    const store1 = configureStore({ reducer: rootReducer });
    const store2 = configureStore({ reducer: rootReducer });

    expect(store1.getState()).toEqual(store2.getState());
  });
});
