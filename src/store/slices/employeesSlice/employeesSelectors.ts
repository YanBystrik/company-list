import { RootState } from '../../store';

export const employeesSelector = (state: RootState) => state.employees.employees;
export const employeesSelectedSelector = (state: RootState) => state.employees.selectedEmployees;
export const firstRenderSelector = (state: RootState) => state.employees.isFirstRender;
