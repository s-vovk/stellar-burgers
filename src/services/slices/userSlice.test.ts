import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import {
  getUser,
  getUserOrders,
  getUserState,
  loginUser,
  logoutUser,
  registerUser,
  TUserState,
  updateUser,
  userReducer
} from './userSlice';
import {
  createPromise,
  fakeOrder,
  fakeUser,
  Response
} from '../../utils/tests';
import { faker } from '@faker-js/faker';
import { AppDispatch, RootState } from '../store';
import { TAuthResponse, TFeedsResponse, TUserResponse } from '@api';
import * as cookie from '../../utils/cookie';

type GetUserResponse = Response<TUserResponse>;
type LoginUserResponse = Response<TAuthResponse>;
type RegisterUserResponse = Response<TAuthResponse>;
type UpdateUserResponse = Response<TUserResponse>;
type GetUserOrdersResponse = Response<TFeedsResponse>;

describe('userSlice', () => {
  let store: EnhancedStore<TUserState>;

  beforeEach(() => {
    store = configureStore({ reducer: userReducer });
  });

  describe('getUserState', () => {
    it('should return correct state', () => {
      const order1 = fakeOrder();
      const order2 = fakeOrder();
      const user = fakeUser();

      const preloadedState = {
        loading: true,
        error: faker.string.uuid(),
        user,
        orders: [order1, order2],
        ordersLoading: false,
        ordersError: null
      };
      store = configureStore({ reducer: userReducer, preloadedState });

      const userState = getUserState({
        user: store.getState()
      } as RootState);

      expect(userState).toEqual(preloadedState);
    });
  });

  describe('async reducers', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('getUser', () => {
      it('should work with pending request', async () => {
        const { promise, resolve } = createPromise<GetUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const dispatch: AppDispatch = store.dispatch;
        const dispatchPromise = dispatch(getUser());

        expect(store.getState().loading).toBe(true);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toBeUndefined();

        const user = fakeUser();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            success: true
          })
        });

        await dispatchPromise;
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
      });

      it('should work with rejected request', async () => {
        (fetch as jest.Mock).mockReturnValue({ ok: false });
        const dispatch: AppDispatch = store.dispatch;

        await dispatch(getUser());
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).not.toBe(null);
      });

      it('shold work with fulfilled request', async () => {
        const { promise, resolve } = createPromise<GetUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const user = fakeUser();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            success: true
          })
        });

        const dispatch: AppDispatch = store.dispatch;
        await dispatch(getUser());

        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
      });
    });

    describe('loginUser', () => {
      it('should work with pending request', async () => {
        const { promise, resolve } = createPromise<LoginUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const dispatch: AppDispatch = store.dispatch;
        const dispatchPromise = dispatch(
          loginUser({ email: '', password: '' })
        );

        expect(store.getState().loading).toBe(true);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toBeUndefined();

        const user = fakeUser();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            refreshToken: '',
            accessToken: '',
            success: true
          })
        });

        await dispatchPromise;
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
      });

      it('should work with rejected request', async () => {
        (fetch as jest.Mock).mockReturnValue({ ok: false });
        const dispatch: AppDispatch = store.dispatch;

        await dispatch(loginUser({ email: '', password: '' }));
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).not.toBe(null);
        expect(store.getState().user).toBeUndefined();
      });

      it('shold work with fulfilled request', async () => {
        const { promise, resolve } = createPromise<LoginUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const user = fakeUser();
        const accessToken = faker.string.uuid();
        const refreshToken = faker.string.uuid();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            accessToken,
            refreshToken,
            success: true
          })
        });

        const dispatch: AppDispatch = store.dispatch;
        await dispatch(loginUser({ email: '', password: '' }));

        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
        expect(document.cookie).toContain('accessToken');
        expect(document.cookie).toContain(accessToken);
        expect(localStorage.getItem('refreshToken')).toEqual(refreshToken);
      });
    });

    describe('registerUser', () => {
      it('should work with pending request', async () => {
        const { promise, resolve } = createPromise<RegisterUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const dispatch: AppDispatch = store.dispatch;
        const dispatchPromise = dispatch(
          registerUser({ email: '', name: '', password: '' })
        );

        expect(store.getState().loading).toBe(true);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toBeUndefined();

        const user = fakeUser();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            refreshToken: '',
            accessToken: '',
            success: true
          })
        });

        await dispatchPromise;
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
      });

      it('should work with rejected request', async () => {
        (fetch as jest.Mock).mockReturnValue({ ok: false });
        const dispatch: AppDispatch = store.dispatch;

        await dispatch(registerUser({ email: '', name: '', password: '' }));
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).not.toBe(null);
        expect(store.getState().user).toBeUndefined();
      });

      it('shold work with fulfilled request', async () => {
        const { promise, resolve } = createPromise<RegisterUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const user = fakeUser();
        const accessToken = faker.string.uuid();
        const refreshToken = faker.string.uuid();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            accessToken,
            refreshToken,
            success: true
          })
        });

        const dispatch: AppDispatch = store.dispatch;
        await dispatch(registerUser({ email: '', name: '', password: '' }));

        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
        expect(document.cookie).toContain('accessToken');
        expect(document.cookie).toContain(accessToken);
        expect(localStorage.getItem('refreshToken')).toEqual(refreshToken);
      });
    });

    describe('logoutUser', () => {
      it('should work with pending request', async () => {
        const { promise, resolve } = createPromise<Response<{}>>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const dispatch: AppDispatch = store.dispatch;
        const dispatchPromise = dispatch(logoutUser());

        expect(store.getState().loading).toBe(true);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toBeUndefined();

        resolve?.({
          ok: true,
          json: () => ({
            success: true
          })
        });

        await dispatchPromise;
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toBeUndefined();
      });

      it('should work with rejected request', async () => {
        (fetch as jest.Mock).mockReturnValue({ ok: false });
        const dispatch: AppDispatch = store.dispatch;

        await dispatch(logoutUser());
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).not.toBe(null);
        expect(store.getState().user).toBeUndefined();
      });

      it('shold work with fulfilled request', async () => {
        const { promise, resolve } = createPromise<Response<{}>>();
        (fetch as jest.Mock).mockReturnValue(promise);

        resolve?.({
          ok: true,
          json: () => ({
            success: true
          })
        });

        Storage.prototype.removeItem = jest.fn();
        const deleteCookieSpy = jest.spyOn(cookie, 'deleteCookie');

        const dispatch: AppDispatch = store.dispatch;
        await dispatch(logoutUser());

        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toBeUndefined();
        expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
        expect(deleteCookieSpy).toHaveBeenCalledWith('accessToken');
      });
    });

    describe('updateUser', () => {
      it('should work with pending request', async () => {
        const { promise, resolve } = createPromise<UpdateUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const dispatch: AppDispatch = store.dispatch;
        const dispatchPromise = dispatch(
          updateUser({ email: '', name: '', password: '' })
        );

        expect(store.getState().loading).toBe(true);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toBeUndefined();

        const user = fakeUser();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            success: true
          })
        });

        await dispatchPromise;
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
      });

      it('should work with rejected request', async () => {
        (fetch as jest.Mock).mockReturnValue({ ok: false });
        const dispatch: AppDispatch = store.dispatch;

        await dispatch(updateUser({ email: '', name: '', password: '' }));
        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).not.toBe(null);
        expect(store.getState().user).toBeUndefined();
      });

      it('shold work with fulfilled request', async () => {
        const { promise, resolve } = createPromise<UpdateUserResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const user = fakeUser();

        resolve?.({
          ok: true,
          json: () => ({
            user,
            success: true
          })
        });

        const dispatch: AppDispatch = store.dispatch;
        await dispatch(updateUser({ email: '', name: '', password: '' }));

        expect(store.getState().loading).toBe(false);
        expect(store.getState().error).toBe(null);
        expect(store.getState().user).toEqual(user);
      });
    });

    describe('getUserOrders', () => {
      it('should work with pending request', async () => {
        const { promise, resolve } = createPromise<GetUserOrdersResponse>();
        (fetch as jest.Mock).mockReturnValue(promise);

        const dispatch: AppDispatch = store.dispatch;
        const dispatchPromise = dispatch(getUserOrders());

        expect(store.getState().ordersLoading).toBe(true);
        expect(store.getState().ordersError).toBe(null);
        expect(store.getState().orders.length).toBe(0);

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
        expect(store.getState().ordersLoading).toBe(false);
        expect(store.getState().ordersError).toBe(null);
        expect(store.getState().orders[0]._id).toBe(order._id);
      });

      it('should work with rejected request', async () => {
        (fetch as jest.Mock).mockReturnValue({ ok: false });
        const dispatch: AppDispatch = store.dispatch;

        await dispatch(getUserOrders());
        expect(store.getState().ordersLoading).toBe(false);
        expect(store.getState().ordersError).not.toBe(null);
      });

      it('shold work with fulfilled request', async () => {
        const { promise, resolve } = createPromise<GetUserOrdersResponse>();
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
        await dispatch(getUserOrders());

        expect(store.getState().ordersLoading).toBe(false);
        expect(store.getState().ordersError).toBe(null);
        expect(store.getState().orders[0]._id).toBe(order._id);
      });
    });
  });
});
