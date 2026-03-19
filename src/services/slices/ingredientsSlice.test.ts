import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import {
  getBuns,
  getIngredient,
  getIngredients,
  getIngredientsState,
  getMains,
  getSauces,
  ingredientsReducer,
  TIngredientsState
} from './ingredientsSlice';
import { AppDispatch, RootState } from '../store';
import { createPromise, fakeIngredient, Response } from '../../utils/tests';
import { TIngredient } from '@utils-types';
import { faker } from '@faker-js/faker';

type GetIngredientsResponse = Response<{
  data: TIngredient[];
}>;

describe('ingredientsSlice', () => {
  let store: EnhancedStore<TIngredientsState>;

  beforeEach(() => {
    store = configureStore({ reducer: ingredientsReducer });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getIngredients', () => {
    it('should work with pending request', async () => {
      const { promise, resolve } = createPromise<GetIngredientsResponse>();
      (fetch as jest.Mock).mockReturnValue(promise);

      const dispatch: AppDispatch = store.dispatch;
      const dispatchPromise = dispatch(getIngredients());

      expect(store.getState().loading).toBe(true);
      expect(store.getState().error).toBe(null);
      expect(store.getState().ingredients.length).toBe(0);

      const ingredient = fakeIngredient();
      resolve?.({
        ok: true,
        json: () => ({ data: [ingredient], success: true })
      });

      await dispatchPromise;
      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).toBe(null);
      expect(store.getState().ingredients[0]._id).toBe(ingredient._id);
    });

    it('should work with rejected request', async () => {
      (fetch as jest.Mock).mockReturnValue({ ok: false });
      const dispatch: AppDispatch = store.dispatch;

      await dispatch(getIngredients());
      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).not.toBe(null);
    });

    it('shold work with fulfilled request', async () => {
      const ingredient = fakeIngredient();
      const { promise, resolve } = createPromise<GetIngredientsResponse>();
      (fetch as jest.Mock).mockReturnValue(promise);
      resolve?.({
        ok: true,
        json: () => ({ data: [ingredient], success: true })
      });

      const dispatch: AppDispatch = store.dispatch;
      await dispatch(getIngredients());

      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).toBe(null);
      expect(store.getState().ingredients[0]._id).toBe(ingredient._id);
    });
  });

  describe('getIngredientsState', () => {
    it('should return correct state', () => {
      const ingredient = fakeIngredient();
      const preloadedState = {
        loading: true,
        error: faker.string.uuid(),
        ingredients: [ingredient]
      };
      store = configureStore({ reducer: ingredientsReducer, preloadedState });

      const ingredientsState = getIngredientsState({
        ingredients: store.getState()
      } as RootState);

      expect(ingredientsState).toEqual(preloadedState);
    });
  });

  describe('getBuns', () => {
    it('should return correct state', () => {
      const bun1 = fakeIngredient({ type: 'bun' });
      const bun2 = fakeIngredient({ type: 'bun' });
      const main = fakeIngredient({ type: 'main' });

      const preloadedState = {
        loading: false,
        error: null,
        ingredients: [main, bun1, bun2]
      };
      store = configureStore({ reducer: ingredientsReducer, preloadedState });

      const buns = getBuns({
        ingredients: store.getState()
      } as RootState);

      expect(buns.length).toEqual(2);
      expect(buns.find((bun) => bun._id === bun1._id)).not.toBeUndefined();
      expect(buns.find((bun) => bun._id === bun2._id)).not.toBeUndefined();
    });
  });

  describe('getMains', () => {
    it('should return correct state', () => {
      const bun = fakeIngredient({ type: 'bun' });
      const main1 = fakeIngredient({ type: 'main' });
      const main2 = fakeIngredient({ type: 'main' });
      const main3 = fakeIngredient({ type: 'main' });

      const preloadedState = {
        loading: false,
        error: null,
        ingredients: [main1, main2, bun, main3]
      };
      store = configureStore({ reducer: ingredientsReducer, preloadedState });

      const mains = getMains({
        ingredients: store.getState()
      } as RootState);

      expect(mains.length).toEqual(3);
      expect(mains.find((main) => main._id === main1._id)).not.toBeUndefined();
      expect(mains.find((main) => main._id === main2._id)).not.toBeUndefined();
      expect(mains.find((main) => main._id === main3._id)).not.toBeUndefined();
    });
  });

  describe('getSauces', () => {
    it('should return correct state', () => {
      const bun = fakeIngredient({ type: 'bun' });
      const main = fakeIngredient({ type: 'main' });
      const sauce1 = fakeIngredient({ type: 'sauce' });
      const sauce2 = fakeIngredient({ type: 'sauce' });

      const preloadedState = {
        loading: false,
        error: null,
        ingredients: [main, sauce1, bun, sauce2]
      };
      store = configureStore({ reducer: ingredientsReducer, preloadedState });

      const sauces = getSauces({
        ingredients: store.getState()
      } as RootState);

      expect(sauces.length).toEqual(2);
      expect(
        sauces.find((sauce) => sauce._id === sauce1._id)
      ).not.toBeUndefined();
      expect(
        sauces.find((sauce) => sauce._id === sauce2._id)
      ).not.toBeUndefined();
    });
  });

  describe('getIngredient', () => {
    it('should return correct state', () => {
      const bun = fakeIngredient({ type: 'bun' });
      const main = fakeIngredient({ type: 'main' });
      const sauce1 = fakeIngredient({ type: 'sauce' });
      const sauce2 = fakeIngredient({ type: 'sauce' });

      const preloadedState = {
        loading: false,
        error: null,
        ingredients: [main, sauce1, bun, sauce2]
      };
      store = configureStore({ reducer: ingredientsReducer, preloadedState });

      const ingredient = getIngredient(
        {
          ingredients: store.getState()
        } as RootState,
        sauce2._id
      );

      expect(ingredient?._id).toEqual(sauce2._id);
    });
  });
});
