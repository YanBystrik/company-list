import * as React from 'react';
import cn from 'classnames';
import { Modal } from '../Modal/Modal';
import s from './EmployeeModal.module.scss';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (employee: {
    id: number;
    companyId: number;
    firstName: string;
    lastName: string;
    position: string;
  }) => void;
  companyId: number;
}

export const EmployeeModal = ({ isOpen, onClose, onCreate, companyId }: CompanyModalProps) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [position, setPosition] = React.useState('');

  const buttonDisabled = !firstName || !lastName || !position;

  const handleCreate = () => {
    onCreate({ id: Date.now(), companyId, firstName, lastName, position });
    onClose();
    setFirstName('');
    setLastName('');
    setPosition('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Добавить cотрудника</h2>
      <div className={s.field}>
        <label>
          Имя<span className={s.star}>*</span>
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className={s.field}>
        <label>
          Фамилия<span className={s.star}>*</span>
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className={s.field}>
        <label>
          Должность<span className={s.star}>*</span>
        </label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
      </div>
      <button
        disabled={buttonDisabled}
        className={cn(s.create, { [s.disabled]: buttonDisabled })}
        onClick={handleCreate}>
        Создать
      </button>
    </Modal>
  );
};
