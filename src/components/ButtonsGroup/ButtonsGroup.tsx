import * as React from 'react';
import cn from 'classnames';
import s from './ButtonsGroup.module.scss';

interface ButtonsGroupProps {
  setIsOpenCompanyModal: (value: boolean) => void;
  handleClickDelete: () => void;
  checkedList: number[];
  showEmployessButtons: boolean;
  setIsOpenEmployeeModal: (value: boolean) => void;
  selectedEmployees: number[];
  handleClickDeleteEmployees: () => void;
}

export const ButtonsGroup = ({
  setIsOpenCompanyModal,
  handleClickDelete,
  checkedList,
  showEmployessButtons,
  setIsOpenEmployeeModal,
  selectedEmployees,
  handleClickDeleteEmployees,
}: ButtonsGroupProps) => {
  return (
    <div className={s.root}>
      <div className={s.buttonsContainer}>
        <div className={s.buttons}>
          <button className={s.addButton} onClick={() => setIsOpenCompanyModal(true)}>
            Добавить компанию
          </button>
          <button
            className={cn(s.deleteButton, { [s.disabled]: !checkedList.length })}
            onClick={handleClickDelete}
            disabled={!checkedList.length}>
            Удалить выбранные
          </button>
        </div>
        {showEmployessButtons && (
          <div className={s.buttons}>
            <button
              className={cn(s.addButton, s.addButtonEmployee)}
              onClick={() => setIsOpenEmployeeModal(true)}>
              Добавить сотрудника
            </button>
            <button
              className={cn(s.deleteButton, { [s.disabled]: !selectedEmployees.length })}
              onClick={handleClickDeleteEmployees}
              disabled={!selectedEmployees.length}>
              Удалить выбранных
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
