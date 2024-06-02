import { configureStore } from '@reduxjs/toolkit';
import companiesReducer from './slices/companiesSlice/companiesSlice';
import employeesReducer from './slices/employeesSlice/employeesSlice';

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
    employees: employeesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
