import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CompaniesState, CompanyEntity } from './types';

const initialState: CompaniesState = {
  companies: [],
};

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    addCompanys(state, action: PayloadAction<CompanyEntity[]>) {
      state.companies = [...state.companies, ...action.payload];
    },
    addCompany(state, action: PayloadAction<CompanyEntity>) {
      state.companies = [action.payload, ...state.companies];
    },
    removeCompanies(state, action: PayloadAction<number[]>) {
      state.companies = state.companies.filter((company) => !action.payload.includes(company.id));
    },
    updateCompany(state, action: PayloadAction<CompanyEntity>) {
      const index = state.companies.findIndex((company) => company.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
    },
  },
});

export const { addCompany, removeCompanies, addCompanys, updateCompany } = companiesSlice.actions;
export default companiesSlice.reducer;
