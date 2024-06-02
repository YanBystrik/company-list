import * as React from 'react';
import cn from 'classnames';
import { EmployeeEntity } from '../../store/slices/employeesSlice/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSelectedEmployees,
  removeSelectedEmployee,
  updateEmployee,
} from '../../store/slices/employeesSlice/employeesSlice';

import s from './Employee.module.scss';
import { employeesSelectedSelector } from '../../store/slices/employeesSlice/employeesSelectors';

interface EmployeeProps {
  employee: EmployeeEntity;
  isCheckedAll: boolean;
  onClickCheckbox: (value: number) => void;
}

export const Employee = ({ employee, isCheckedAll, onClickCheckbox }: EmployeeProps) => {
  const dispatch = useDispatch();

  const selectedEmployees = useSelector(employeesSelectedSelector);

  const [isChecked, setIsChecked] = React.useState(false);
  const [firstName, setFirstName] = React.useState(employee.firstName);
  const [lastName, setLastName] = React.useState(employee.lastName);
  const [position, setPosition] = React.useState(employee.position);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onClickCheckbox(employee.id);

    if (selectedEmployees.includes(employee.id)) {
      dispatch(removeSelectedEmployee(employee.id));
    } else {
      dispatch(addSelectedEmployees([employee.id]));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //В реальном проекте здесь бы отрпавлялся запрос на обновление сотрудника
    setFirstName(e.target.value);
    dispatch(updateEmployee({ ...employee, firstName: e.target.value }));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //В реальном проекте здесь бы отрпавлялся запрос на обновление сотрудника
    setLastName(e.target.value);
    dispatch(updateEmployee({ ...employee, lastName: e.target.value }));
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //В реальном проекте здесь бы отрпавлялся запрос на обновление сотрудника
    setPosition(e.target.value);
    dispatch(updateEmployee({ ...employee, position: e.target.value }));
  };

  React.useEffect(() => {
    if (isCheckedAll) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [isCheckedAll]);

  return (
    <tr className={cn({ [s.checked]: isChecked })}>
      <td className={s.element}>
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
      </td>
      <td className={s.element}>
        <input className={s.input} type="text" value={lastName} onChange={handleLastNameChange} />
      </td>
      <td className={s.element}>
        <input className={s.input} type="text" value={firstName} onChange={handleNameChange} />
      </td>
      <td className={s.element}>
        <input className={s.input} type="text" value={position} onChange={handlePositionChange} />
      </td>
    </tr>
  );
};
