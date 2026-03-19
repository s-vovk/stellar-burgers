import { faker } from '@faker-js/faker';
import { TConstructorIngredient, TOrder } from '@utils-types';
import {
  constructorItemsReducer,
  addItem,
  TConstructorItems,
  removeItem,
  moveItemUp,
  moveItemDown,
  resetLastOrder,
  initialState,
  orderBurger
} from './constructorItemsSlice';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { Response, fakeIngredient, createPromise } from '../../utils/tests';

type OrderBurgerResponse = Response<{
  order: Omit<TOrder, 'ingredients'>;
  success: boolean;
}>;

const fakeOrder = (): Omit<TOrder, 'ingredients'> => ({
  _id: faker.string.uuid(),
  status: 'in progress',
  name: faker.commerce.productName(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  number: faker.number.int()
});

describe('constructorItemsSlice', () => {
  let store: EnhancedStore<TConstructorItems>;

  beforeEach(() => {
    store = configureStore({ reducer: constructorItemsReducer });
  });

  describe('add item', () => {
    it('should add sauce and main', () => {
      const sauceId = 'test-id';
      const sauce = fakeIngredient({ id: sauceId, type: 'sauce' });

      store.dispatch(addItem({ ...sauce }));

      expect(store.getState().ingredients.length).toEqual(1);
      expect(
        store.getState().ingredients.find((item) => item.id === sauceId)
      ).not.toBeUndefined();

      const main = fakeIngredient({ type: 'main' });
      store.dispatch(addItem({ ...main }));

      expect(store.getState().ingredients.length).toEqual(2);
      expect(
        store.getState().ingredients.find((item) => item.type === 'main')
      ).not.toBeUndefined();

      expect(store.getState().bun).toBeUndefined();
      expect(
        store.getState().ingredients.find((item) => item.type === 'bun')
      ).toBeUndefined();
    });

    it('should add bun', () => {
      const name = 'my favorite cosmic bun';
      const bun = fakeIngredient({ name, type: 'bun' });

      store.dispatch(addItem({ ...bun }));

      expect(store.getState().ingredients.length).toEqual(0);
      expect(store.getState().bun?.name).toBe(name);
    });
  });

  describe('remove item', () => {
    it('should remove sauce and main', () => {
      const sauceId = 'sauce-id';
      const sauce = fakeIngredient({ id: sauceId, type: 'sauce' });
      const mainId = 'main-id';
      const main = fakeIngredient({ id: mainId, type: 'main' });

      store.dispatch(addItem({ ...sauce }));
      store.dispatch(addItem({ ...main }));

      expect(store.getState().ingredients.length).toBe(2);

      store.dispatch(removeItem(mainId));

      expect(store.getState().ingredients.length).toBe(1);
      expect(
        store.getState().ingredients.find((item) => item.id === mainId)
      ).toBeUndefined();
      expect(
        store.getState().ingredients.find((item) => item.id === sauceId)
      ).not.toBeUndefined();

      store.dispatch(removeItem(sauceId));

      expect(store.getState().ingredients.length).toBe(0);
    });

    it('should remove bun', () => {
      const bun1 = fakeIngredient({ id: 'bun-1', type: 'bun' });
      const bun2 = fakeIngredient({ id: 'bun-2', type: 'bun' });

      store.dispatch(addItem({ ...bun1 }));
      expect(store.getState().bun?.id === bun1.id);

      // The bun can not be removed. Only can be replaced by another bun.
      store.dispatch(addItem(bun2));
      expect(store.getState().bun?.id === bun2.id);
    });
  });

  describe('move item up and down', () => {
    const sauce = fakeIngredient({ type: 'sauce' });
    const main = fakeIngredient({ type: 'main' });

    it('should move item up', () => {
      store.dispatch(addItem({ ...main }));
      store.dispatch(addItem({ ...sauce }));

      expect(store.getState().ingredients[0].id).toBe(main.id);
      expect(store.getState().ingredients[1].id).toBe(sauce.id);

      store.dispatch(moveItemUp(sauce.id));
      expect(store.getState().ingredients[0].id).toBe(sauce.id);

      // The first element should stay on the same place.
      store.dispatch(moveItemUp(sauce.id));
      expect(store.getState().ingredients[0].id).toBe(sauce.id);
    });

    it('should move item down', () => {
      store.dispatch(addItem({ ...main }));
      store.dispatch(addItem({ ...sauce }));

      expect(store.getState().ingredients[0].id).toBe(main.id);
      expect(store.getState().ingredients[1].id).toBe(sauce.id);

      store.dispatch(moveItemDown(main.id));
      expect(store.getState().ingredients[0].id).toBe(sauce.id);
      expect(store.getState().ingredients[1].id).toBe(main.id);

      // The last element should stay on the same place.
      store.dispatch(moveItemDown(main.id));
      expect(store.getState().ingredients[1].id).toBe(main.id);
    });
  });

  describe('last order', () => {
    it('should reset last order', () => {
      const lastOrder = fakeOrder();
      store = configureStore({
        reducer: constructorItemsReducer,
        preloadedState: { ...initialState, lastOrder }
      });
      expect(store.getState().lastOrder).not.toBeUndefined();

      store.dispatch(resetLastOrder());
      expect(store.getState().lastOrder).toBeUndefined();
    });
  });

  describe('order burger', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should work with pending request', async () => {
      const { promise, resolve } = createPromise<OrderBurgerResponse>();
      (fetch as jest.Mock).mockReturnValue(promise);

      const dispatch: AppDispatch = store.dispatch;
      const dispatchPromise = dispatch(orderBurger(['1']));

      expect(store.getState().orderRequest).toBe(true);
      expect(store.getState().orderRequestError).toBe(null);
      expect(store.getState().lastOrder).toBe(undefined);

      const order = fakeOrder();
      resolve?.({
        ok: true,
        json: () => ({ order, success: true })
      });

      await dispatchPromise;
      expect(store.getState().orderRequest).toBe(false);
      expect(store.getState().orderRequestError).toBe(null);
      expect(store.getState().bun).toBe(undefined);
      expect(store.getState().lastOrder?._id).toBe(order._id);
      expect(store.getState().ingredients.length).toBe(0);
    });

    it('should work with rejected request', async () => {
      (fetch as jest.Mock).mockReturnValue({ ok: false });
      const dispatch: AppDispatch = store.dispatch;

      await dispatch(orderBurger(['1']));
      expect(store.getState().orderRequest).toBe(false);
      expect(store.getState().orderRequestError).not.toBe(null);
    });

    it('shold work with fulfilled request', async () => {
      const order = fakeOrder();
      (fetch as jest.Mock).mockReturnValue({
        ok: true,
        json: () => ({ order, success: true })
      });

      const dispatch: AppDispatch = store.dispatch;
      await dispatch(orderBurger(['1']));

      expect(store.getState().orderRequest).toBe(false);
      expect(store.getState().orderRequestError).toBe(null);
      expect(store.getState().bun).toBe(undefined);
      expect(store.getState().lastOrder?._id).toBe(order._id);
      expect(store.getState().ingredients.length).toBe(0);
    });
  });
});
