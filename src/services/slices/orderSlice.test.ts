import { TFeedsResponse, TOrderResponse } from '@api';
import { createPromise, fakeOrder, Response } from '../../utils/tests';
import { AppDispatch, RootState } from '../store';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import {
  getOrderByNumber,
  getOrderInfo,
  getOrders,
  getOrdersState,
  ordersReducer,
  TOrdersState
} from './ordersSlice';
import { faker } from '@faker-js/faker';

type GetOrdersResponse = Response<TFeedsResponse>;
type GetOrderByNumberResponse = Response<TOrderResponse>;

describe('orderSlice', () => {
  let store: EnhancedStore<TOrdersState>;

  beforeEach(() => {
    store = configureStore({ reducer: ordersReducer });
  });

  describe('getOrders', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should work with pending request', async () => {
      const { promise, resolve } = createPromise<GetOrdersResponse>();
      (fetch as jest.Mock).mockReturnValue(promise);

      const dispatch: AppDispatch = store.dispatch;
      const dispatchPromise = dispatch(getOrders());

      expect(store.getState().loading).toBe(true);
      expect(store.getState().error).toBe(null);
      expect(store.getState().orders.length).toBe(0);
      expect(store.getState().total).toBe(0);
      expect(store.getState().totalToday).toBe(0);

      const order = fakeOrder();
      const total = faker.number.int();
      const totalToday = faker.number.int();

      resolve?.({
        ok: true,
        json: () => ({
          orders: [order],
          total,
          totalToday,
          success: true
        })
      });

      await dispatchPromise;
      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).toBe(null);
      expect(store.getState().total).toBe(total);
      expect(store.getState().totalToday).toBe(totalToday);
      expect(store.getState().orders[0]._id).toBe(order._id);
    });

    it('should work with rejected request', async () => {
      (fetch as jest.Mock).mockReturnValue({ ok: false });
      const dispatch: AppDispatch = store.dispatch;

      await dispatch(getOrders());
      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).not.toBe(null);
    });

    it('shold work with fulfilled request', async () => {
      const { promise, resolve } = createPromise<GetOrdersResponse>();
      (fetch as jest.Mock).mockReturnValue(promise);

      const order = fakeOrder();
      const total = faker.number.int();
      const totalToday = faker.number.int();

      resolve?.({
        ok: true,
        json: () => ({
          orders: [order],
          total,
          totalToday,
          success: true
        })
      });

      const dispatch: AppDispatch = store.dispatch;
      await dispatch(getOrders());

      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).toBe(null);
      expect(store.getState().total).toBe(total);
      expect(store.getState().totalToday).toBe(totalToday);
      expect(store.getState().orders[0]._id).toBe(order._id);
    });
  });

  describe('getOrderByNumber', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should work with pending request', async () => {
      const { promise, resolve } = createPromise<GetOrderByNumberResponse>();
      (fetch as jest.Mock).mockReturnValue(promise);

      const order = fakeOrder();

      const dispatch: AppDispatch = store.dispatch;
      const dispatchPromise = dispatch(getOrderByNumber(order.number));

      expect(store.getState().loading).toBe(true);
      expect(store.getState().error).toBe(null);
      expect(store.getState().orders.length).toBe(0);

      resolve?.({
        ok: true,
        json: () => ({
          orders: [order],
          success: true
        })
      });

      await dispatchPromise;
      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).toBe(null);
      expect(store.getState().orders[0]._id).toBe(order._id);
    });

    it('should work with rejected request', async () => {
      (fetch as jest.Mock).mockReturnValue({ ok: false });
      const dispatch: AppDispatch = store.dispatch;

      await dispatch(getOrderByNumber(1));
      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).not.toBe(null);
      expect(store.getState().orders.length).toEqual(0);
    });

    it('shold work with fulfilled request', async () => {
      const { promise, resolve } = createPromise<GetOrderByNumberResponse>();
      (fetch as jest.Mock).mockReturnValue(promise);

      const order = fakeOrder();

      resolve?.({
        ok: true,
        json: () => ({
          orders: [order],
          success: true
        })
      });

      const dispatch: AppDispatch = store.dispatch;
      await dispatch(getOrders());

      expect(store.getState().loading).toBe(false);
      expect(store.getState().error).toBe(null);
      expect(store.getState().orders[0]._id).toBe(order._id);
    });
  });

  describe('getOrdersState', () => {
    it('should return correct state', () => {
      const order1 = fakeOrder();
      const order2 = fakeOrder();
      const total = faker.number.int();
      const totalToday = faker.number.int();

      const preloadedState = {
        loading: true,
        error: faker.string.uuid(),
        orders: [order1, order2],
        total,
        totalToday
      };
      store = configureStore({ reducer: ordersReducer, preloadedState });

      const ordersState = getOrdersState({
        orders: store.getState()
      } as RootState);

      expect(ordersState).toEqual(preloadedState);
    });
  });

  describe('getOrderInfo', () => {
    it('should return correct state', () => {
      const order1 = fakeOrder();
      const order2 = fakeOrder();
      const total = faker.number.int();
      const totalToday = faker.number.int();

      const preloadedState = {
        loading: false,
        error: null,
        orders: [order1, order2],
        total,
        totalToday
      };
      store = configureStore({ reducer: ordersReducer, preloadedState });

      const order = getOrderInfo(
        {
          orders: store.getState()
        } as RootState,
        order2.number
      );

      expect(order?.number).toEqual(order2.number);
    });
  });
});
