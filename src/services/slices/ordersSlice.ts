import { getFeedsApi, getOrderByNumberApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TOrdersState = {
  loading: boolean;
  error: null | string;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TOrdersState = {
  loading: false,
  error: null,
  orders: [],
  total: 0,
  totalToday: 0
};

export const getOrders = createAsyncThunk('orders/getAll', async () =>
  getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number | string) => getOrderByNumberApi(Number(number))
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      });
  }
});

export const getOrdersState = (state: RootState) => state.orders;
export const getOrderInfo = createSelector(
  [getOrdersState, (_, number) => number],
  (state, number) =>
    state.orders.find((order: TOrder) => String(order.number) === number)
);

export const ordersReducer = ordersSlice.reducer;
