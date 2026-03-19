import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { RootState } from '../store';
import { orderBurgerApi } from '@api';

export type TConstructorItems = {
  bun?: TConstructorIngredient;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderRequestError: string | null;
  lastOrder?: Omit<TOrder, 'ingredients'>;
};

export const initialState: TConstructorItems = {
  bun: undefined,
  ingredients: [],
  orderRequest: false,
  orderRequestError: null
};

export const orderBurger = createAsyncThunk(
  'constructor/order',
  async (data: string[]) => orderBurgerApi(data)
);

const constructorItemsSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      const item = action.payload;

      if (item.type === 'bun') {
        state.bun = item;
      } else {
        state.ingredients.push(item);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveItemUp: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index) {
        const ingredients = state.ingredients.splice(index, 1);
        state.ingredients.splice(index - 1, 0, ...ingredients);
      }
    },
    moveItemDown: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index < state.ingredients.length - 1) {
        const ingredients = state.ingredients.splice(index, 1);
        state.ingredients.splice(index + 1, 0, ...ingredients);
      }
    },
    resetLastOrder: (state) => {
      state.lastOrder = undefined;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderRequestError = null;
        state.lastOrder = undefined;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderRequestError = action.error.message || null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.lastOrder = action.payload.order;
        state.bun = undefined;
        state.ingredients = [];
      });
  }
});

export const getConstructorItems = (state: RootState) => state.constructorItems;

export const constructorItemsReducer = constructorItemsSlice.reducer;
export const { addItem, removeItem, moveItemUp, moveItemDown, resetLastOrder } =
  constructorItemsSlice.actions;
