import * as React from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { updateCompany } from '../../store/slices/companiesSlice/companiesSlice';
import { CompanyEntity } from '../../store/slices/companiesSlice/types';

import s from './Company.module.scss';
import { EmployeeEntity } from '../../store/slices/employeesSlice/types';

interface CompanyProps {
  company: CompanyEntity;
  isCheckedAll: boolean;
  onClickCheckbox: (value: number) => void;
  employees: EmployeeEntity[];
  isLast: boolean;
}

export const Company = ({
  company,
  isCheckedAll,
  onClickCheckbox,
  employees,
  isLast,
}: CompanyProps) => {
  const dispatch = useDispatch();

  const [isChecked, setIsChecked] = React.useState(false);
  const [name, setName] = React.useState(company.name);
  const [address, setAddress] = React.useState(company.address);
  const [isNameOverflow, setIsNameOverflow] = React.useState(false);
  const [isAddressOverflow, setIsAddressOverflow] = React.useState(false);

  const nameRef = React.useRef<HTMLInputElement>(null);
  const addressRef = React.useRef<HTMLInputElement>(null);

  const companyEmployees = employees.filter((employee) => employee.companyId === company.id);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onClickCheckbox(company.id);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //В реальном проекте здесь бы отрпавлялся запрос на обновление компании
    setName(e.target.value);
    dispatch(updateCompany({ ...company, name: e.target.value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //В реальном проекте здесь бы отрпавлялся запрос на обновление компании
    setAddress(e.target.value);
    dispatch(updateCompany({ ...company, address: e.target.value }));
  };

  const checkOverflow = (element: HTMLInputElement) => {
    return element.scrollWidth > element.clientWidth;
  };

  React.useEffect(() => {
    if (isCheckedAll) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [isCheckedAll]);

  React.useEffect(() => {
    nameRef.current && setIsNameOverflow(checkOverflow(nameRef.current));
    addressRef.current && setIsAddressOverflow(checkOverflow(addressRef.current));
  }, [name, address]);

  return (
    <tr className={cn(s.row, { [s.checked]: isChecked })}>
      <td className={cn(s.element, { [s.last]: isLast })}>
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
      </td>
      <td className={cn(s.element, { [s.last]: isLast })}>
        <div className={s.tooltipContainer}>
          <input
            className={s.input}
            ref={nameRef}
            type="text"
            value={name}
            onChange={handleNameChange}
          />
          {isNameOverflow && <div className={s.tooltip}>{name}</div>}
        </div>
      </td>
      {/* Чтобы показать кол-во сотрудников я просто использую длину массива
          но в таком случае у нас длина меняется при пагинации и счетчик обновляется,
          в реальном проекте это должно было бы быть предусмотрено и кол-во сотрудников
          мы бы получали при первом запросе сотрудников и хранили бы в сторе
      */}
      <td className={cn(s.element, { [s.last]: isLast })}>{companyEmployees.length}</td>
      <td className={cn(s.element, { [s.last]: isLast })}>
        <div className={s.tooltipContainer}>
          <input
            className={s.input}
            ref={addressRef}
            type="text"
            value={address}
            onChange={handleAddressChange}
          />
          {isAddressOverflow && <div className={s.tooltip}>{address}</div>}
        </div>
      </td>
    </tr>
  );
};
