import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmployeeEntity } from './types';

interface EmployeesState {
  employees: EmployeeEntity[];
  selectedEmployees: number[];
  isFirstRender: boolean;
}

const initialState: EmployeesState = {
  employees: [],
  selectedEmployees: [],
  //Флаг чтоб отслеживать первый рендер и избегать ошибки по keys из-за добавления тех же сотрудников
  isFirstRender: true,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addSelectedEmployees: (state, action) => {
      const newEmployees = action.payload.filter(
        (employeeId: number) => !state.selectedEmployees.includes(employeeId),
      );
      state.selectedEmployees = [...state.selectedEmployees, ...newEmployees];
    },

    removeSelectedEmployee: (state, action) => {
      state.selectedEmployees = state.selectedEmployees.filter((item) => item !== action.payload);
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployees = initialState.selectedEmployees;
    },
    addEmployee: (state, action: PayloadAction<EmployeeEntity>) => {
      state.employees = [action.payload, ...state.employees];
    },
    addEmployees: (state, action: PayloadAction<EmployeeEntity[]>) => {
      state.employees = [...state.employees, ...action.payload];
    },
    removeEmployee: (state, action: PayloadAction<number[]>) => {
      state.employees = state.employees.filter((employee) => !action.payload.includes(employee.id));
    },
    updateEmployee: (state, action: PayloadAction<EmployeeEntity>) => {
      const index = state.employees.findIndex((employee) => employee.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    toogleFirstRender: (state) => {
      state.isFirstRender = false;
    },
  },
});

export const {
  addEmployee,
  addEmployees,
  removeEmployee,
  updateEmployee,
  addSelectedEmployees,
  removeSelectedEmployee,
  clearSelectedEmployee,
  toogleFirstRender,
} = employeesSlice.actions;
export default employeesSlice.reducer;
