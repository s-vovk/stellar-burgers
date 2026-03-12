import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const getIngredientsState = (state: RootState) => state.ingredients;
export const getBuns = createSelector([getIngredientsState], (state) =>
  state.ingredients.filter(({ type }: TIngredient) => type === 'bun')
);
export const getMains = createSelector([getIngredientsState], (state) =>
  state.ingredients.filter(({ type }: TIngredient) => type === 'main')
);
export const getSauces = createSelector([getIngredientsState], (state) =>
  state.ingredients.filter(({ type }: TIngredient) => type === 'sauce')
);
export const getIngredient = createSelector(
  [getIngredientsState, (_, id) => id],
  (state, id) =>
    state.ingredients.find((ingredient: TIngredient) => ingredient._id === id)
);

// export const {} = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
