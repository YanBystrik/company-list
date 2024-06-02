import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Company } from '../Company/Company';
import { companiesSelector } from '../../store/slices/companiesSlice/companiesSelectors';
import {
  addCompany,
  addCompanys,
  removeCompanies,
} from '../../store/slices/companiesSlice/companiesSlice';
import { data, mockEmployees, newData } from '../../constants';
import { CompanyModal } from '../CompanyModal';
import { CompanyEntity } from '../../store/slices/companiesSlice/types';
import {
  addEmployee,
  addEmployees,
  clearSelectedEmployee,
  removeEmployee,
  toogleFirstRender,
} from '../../store/slices/employeesSlice/employeesSlice';
import { EmployeesTable } from '../EmployeesTable';
import {
  employeesSelectedSelector,
  employeesSelector,
  firstRenderSelector,
} from '../../store/slices/employeesSlice/employeesSelectors';

import s from './CompanyTable.module.scss';
import { EmployeeModal } from '../EmployeeModal';
import { EmployeeEntity } from '../../store/slices/employeesSlice/types';
import { ButtonsGroup } from '../ButtonsGroup';
import useUpdateEffect from '../../hooks/useUpdateEffect';

export const CompanyTable = () => {
  const dispatch = useDispatch();

  const companies = useSelector(companiesSelector);
  const employees = useSelector(employeesSelector);
  const selectedEmployees = useSelector(employeesSelectedSelector);

  const [isCheckedAll, setIsCheckedAll] = React.useState(false);
  const [checkedList, setCheckedList] = React.useState<number[]>([]);
  const [isOpenCompanyModal, setIsOpenCompanyModal] = React.useState(false);
  const [isOpenEmployeeModal, setIsOpenEmployeeModal] = React.useState(false);

  //page и также perPage должны были бы приходить в headers когда мы получали бы
  //список компаний, так же там было бы общее кол-во страниц чтобы мы
  //понимали когда отправлять запрос на некст страницу уже не надо
  const [page, setPage] = React.useState(1);

  //isLoading хранился бы в сторе, но здесь для моего удобства я решил юзнуть стейт
  const [isLoading, setIsLoading] = React.useState(false);

  const tableContainerRef = React.useRef(null);

  const selectedCompanyEmployees = employees.filter(
    (employee) => employee.companyId === checkedList[0],
  );

  const showEmployessButtons = checkedList.length === 1;
  const showEmployeesTable = showEmployessButtons && Boolean(selectedCompanyEmployees.length);

  const handleCheckboxChange = () => {
    if (isCheckedAll) {
      setCheckedList([]);
    } else {
      companies.forEach((item) => {
        setCheckedList((prevList) => {
          if (!prevList.includes(item.id)) {
            return [...prevList, item.id];
          }
          return prevList;
        });
      });
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

  const handleClickDelete = () => {
    //Здесь надо было бы отрпавить запрос с удалением
    //и заново запросить список наших компаний,
    //или поместить в стор то что пришло бы в ответ на запрос удаления
    dispatch(removeCompanies(checkedList));
    setCheckedList([]);
    setIsCheckedAll(false);
  };

  const handleClickDeleteEmployees = () => {
    dispatch(removeEmployee(selectedEmployees));

    dispatch(clearSelectedEmployee());
  };

  const handleCreateCompany = (company: CompanyEntity) => {
    //Здесь надо было бы отрпавить запрос на создание
    //и заново запросить список наших компаний
    dispatch(addCompany(company));
  };

  const handleAddEmployee = (employee: EmployeeEntity) => {
    //Здесь надо было бы отрпавить запрос на создание
    //и заново запросить список наших компаний
    dispatch(addEmployee(employee));
  };

  //Здесь я решил юзануть кастомный хук чтобы скипнуть первый рендер
  //В реальном проекте где мы запрашиваем данные с сервера
  //все это бы происходило в useEffect ниже, мы бы дергали ручку
  //с нужными page и perPage и докладывали данные в стор
  useUpdateEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);

      dispatch(addCompanys(newData));
      setIsLoading(false);
    };

    loadCompanies();

    //page <= 1 чтобы ограничиться одной дозагрузкой
  }, [page <= 1, dispatch]);

  React.useEffect(() => {
    // Здесь была бы санка на запрос для получения данных
    // Но т.к у нас моковые сразу дергаем экшн
    dispatch(addCompanys(data));

    //Сейчас я "запрашиваю" сотрудников вместе с компаниями, в реальном проекте
    //мы бы запрашивали список нужных сотрудников при выделении компании,
    //если выделили несколько компаний то очищали бы стор сотрудников и
    //запрашивали новых сотрудников только когда массив выделенных компаний состоит из 1 элемента.
    dispatch(addEmployees(mockEmployees));
  }, []);

  const handleScroll = () => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  return (
    <div className={s.root}>
      <div className={s.tableContainer} ref={tableContainerRef} onScroll={handleScroll}>
        <table className={s.companyTable}>
          <thead className={s.tableHeader}>
            <tr>
              <th className={(s.checkboxContainer, s.header)}>
                <input
                  className={s.checkbox}
                  type="checkbox"
                  checked={isCheckedAll}
                  onChange={handleCheckboxChange}
                />
                Выделить все
              </th>
              <th className={s.header}>Название компании</th>
              <th className={s.header}>Количество сотрудников</th>
              <th className={s.header}>Адрес</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <Company
                company={company}
                isCheckedAll={isCheckedAll}
                key={`COMPANY_${company.id}`}
                onClickCheckbox={onClickCheckbox}
                employees={employees}
                isLast={index === companies.length - 1}
              />
            ))}
            {/* Тут мы бы показывали компонент CompanyStubs когда isLoading === true
                чтобы обозначить юзеру что идет загрузка данных
            */}
          </tbody>
        </table>
        <ButtonsGroup
          checkedList={checkedList}
          showEmployessButtons={showEmployessButtons}
          setIsOpenCompanyModal={setIsOpenCompanyModal}
          handleClickDelete={handleClickDelete}
          handleClickDeleteEmployees={handleClickDeleteEmployees}
          selectedEmployees={selectedEmployees}
          setIsOpenEmployeeModal={setIsOpenEmployeeModal}
        />
      </div>
      {showEmployeesTable && <EmployeesTable employees={selectedCompanyEmployees} />}

      <CompanyModal
        isOpen={isOpenCompanyModal}
        onCreate={handleCreateCompany}
        onClose={() => setIsOpenCompanyModal(false)}
      />
      <EmployeeModal
        isOpen={isOpenEmployeeModal}
        onCreate={handleAddEmployee}
        onClose={() => setIsOpenEmployeeModal(false)}
        companyId={checkedList[0]}
      />
    </div>
  );
};
