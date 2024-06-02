import * as React from 'react';
import { EmployeeEntity } from '../../store/slices/employeesSlice/types';
import s from './EmployeesTable.module.scss';
import { Employee } from '../Employee/Employee';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEmployees,
  addSelectedEmployees,
  clearSelectedEmployee,
  toogleFirstRender,
} from '../../store/slices/employeesSlice/employeesSlice';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import { newEmployees } from '../../constants';
import { firstRenderSelector } from '../../store/slices/employeesSlice/employeesSelectors';

interface EmployeeTableProps {
  employees: EmployeeEntity[];
}

export const EmployeesTable = ({ employees }: EmployeeTableProps) => {
  const dispatch = useDispatch();

  const isFirstRender = useSelector(firstRenderSelector);

  const [isCheckedAll, setIsCheckedAll] = React.useState(false);
  const [checkedList, setCheckedList] = React.useState<number[]>([]);

  //page и также perPage должны были бы приходить в headers когда мы получали бы
  //список компаний, так же там было бы общее кол-во страниц чтобы мы
  //понимали когда отправлять запрос на некст страницу уже не надо
  const [page, setPage] = React.useState(1);

  //isLoading хранился бы в сторе, но здесь для моего удобства я решил юзнуть стейт
  const [isLoading, setIsLoading] = React.useState(false);

  const tableContainerRef = React.useRef(null);

  const handleCheckboxChange = () => {
    if (isCheckedAll) {
      dispatch(clearSelectedEmployee());
    } else {
      const employeesIds = employees.map((item) => item.id);
      dispatch(addSelectedEmployees(employeesIds));
    }
    setIsCheckedAll(!isCheckedAll);
  };

  const onClickCheckbox = (id: number) => {
    if (checkedList.includes(id)) {
      setCheckedList(checkedList.filter((item) => item !== id));
    } else {
      setCheckedList([...checkedList, id]);
    }
  };

  const handleScroll = () => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useUpdateEffect(() => {
    //Чтобы избавиться от ошибки keys и добаления тех же сотрудников после ререндера я добавил
    //флаг isFirstRender в стор сотрудников
    //В реальном проекте такого бы не возникло потому что мы бы отправляля запрос с нужным
    //page и perPage
    if (isFirstRender) {
      const loadCompanies = async () => {
        setIsLoading(true);

        dispatch(addEmployees(newEmployees));
        setIsLoading(false);
      };

      loadCompanies();
      dispatch(toogleFirstRender());
    }

    //page <= 1 чтобы ограничиться одной дозагрузкой
  }, [page <= 1, dispatch]);

  return (
    <div className={s.root}>
      <div className={s.tableContainer} ref={tableContainerRef} onScroll={handleScroll}>
        <table className={s.employeeTable}>
          <thead className={s.tableHeader}>
            <tr>
              <th className={s.checkboxContainer}>
                <input
                  className={s.checkbox}
                  type="checkbox"
                  checked={isCheckedAll}
                  onChange={handleCheckboxChange}
                />
                Выделить все
              </th>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Должность</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <Employee
                employee={employee}
                isCheckedAll={isCheckedAll}
                onClickCheckbox={onClickCheckbox}
                key={employee.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
